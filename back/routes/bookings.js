import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import auth, { isAdminRequest } from '../middleware/authMiddleware.js';
import { sendBookingConfirmation } from '../services/emailService.js';

const router = express.Router();

// Argentina es UTC-3 fijo (hoy no aplica horario de verano).
// Si eso cambia alguna vez, revisar este offset hardcodeado.
function arToUTC(dateStr, timeStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [h, min] = timeStr.split(':').map(Number);
    return new Date(Date.UTC(y, m - 1, d, h + 3, min, 0, 0));
}

// GET: público (el modal de reserva necesita ver los turnos del día)
// Sin token solo devuelve los campos para calcular disponibilidad — nunca datos de clientes.
router.get('/', async (req, res) => {
    try {
        const query = req.query.date ? { dateStr: req.query.date } : {};
        let dbQuery = Booking.find(query).sort({ time: 1 });
        if (!isAdminRequest(req))
            dbQuery = dbQuery.select('dateStr time serviceDuration status');
        const bookings = await dbQuery;
        res.json(Array.isArray(bookings) ? bookings : []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: público (clientes reservan sin auth)
router.post('/', async (req, res) => {
    const { clientName, clientPhone, clientEmail, service, dateStr, time } = req.body;

    if (!dateStr || !time)
        return res.status(400).json({ message: 'Faltan datos: dateStr o time.' });

    // Solo el admin puede bloquear horarios; el público siempre crea turnos confirmados
    const isAdmin = isAdminRequest(req);
    if (req.body.status === 'blocked' && !isAdmin)
        return res.status(401).json({ message: 'Solo el admin puede bloquear horarios.' });
    const status = req.body.status === 'blocked' ? 'blocked' : 'confirmed';

    try {
        let serviceName, serviceDuration;
        if (status === 'blocked') {
            serviceName = service?.title || 'Horario bloqueado';
            serviceDuration = Number(service?.duration);
        } else {
            if (!clientName?.trim() || !clientPhone?.trim())
                return res.status(400).json({ message: 'Nombre y teléfono son obligatorios.' });
            // Nombre y duración del servicio salen de la base — no confiamos en lo que mande el cliente
            const dbService = service?._id ? await Service.findById(service._id) : null;
            if (!dbService)
                return res.status(400).json({ message: 'Servicio inválido.' });
            serviceName = dbService.title;
            serviceDuration = dbService.duration;
        }

        if (!Number.isFinite(serviceDuration) || serviceDuration <= 0)
            return res.status(400).json({ message: 'Duración inválida.' });

        const startTime = arToUTC(dateStr, time);
        const endTime = new Date(startTime.getTime() + serviceDuration * 60 * 1000);

        if (startTime < new Date())
            return res.status(400).json({ message: 'No podés reservar un turno en el pasado.' });

        const overlap = await Booking.findOne({
            status: { $ne: 'cancelled' },
            dateStr,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });
        if (overlap)
            return res.status(400).json({ message: 'Ese horario ya está ocupado.' });

        // Calcular endTime como string "HH:MM" para el email
        const endTotalMin = (startTime.getUTCHours() - 3 + 24) % 24 * 60 + startTime.getUTCMinutes() + serviceDuration;
        const endTimeStr = `${String(Math.floor(endTotalMin / 60)).padStart(2, '0')}:${String(endTotalMin % 60).padStart(2, '0')}`;

        const newBooking = new Booking({
            clientName,
            clientPhone,
            clientEmail: clientEmail || '',
            serviceName,
            serviceDuration,
            dateStr,
            time,
            startTime,
            endTime,
            status
        });

        const saved = await newBooking.save();

        // Enviar email de confirmación (no bloqueante)
        if (clientEmail && status !== 'blocked') {
            sendBookingConfirmation({
                clientName,
                clientEmail,
                serviceName,
                dateStr,
                time,
                endTime: endTimeStr,
            }).catch(err => console.error('Error enviando email:', err.message));
        }

        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error al reservar.' });
    }
});

// PATCH: cancelar — solo admin
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Turno no encontrado.' });
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'El turno ya estaba cancelado.' });
        booking.status = 'cancelled';
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE: solo admin
router.delete('/:id', auth, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Turno eliminado.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;