import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, Clock, User, Check, ChevronRight, ChevronLeft,
    AlertCircle, Phone, ExternalLink, Sparkles, AlertTriangle, Mail
} from 'lucide-react';
import CalendarReact from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../index.css';
import { API, getToken } from '../utils/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
function timeToMinutes(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function addMinutesToTime(t, mins) {
    const total = timeToMinutes(t) + mins;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
function generateSlots(open, close, interval) {
    const slots = []; let cur = timeToMinutes(open); const end = timeToMinutes(close);
    while (cur <= end) { slots.push(`${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`); cur += interval; }
    return slots;
}

// Google Calendar link
function buildGoogleCalendarUrl({ title, date, startTime, endTime, description }) {
    const pad = n => String(n).padStart(2, '0');
    const d = new Date(date);
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const fmt = (y, mo, day, h, mi) =>
        `${y}${pad(mo + 1)}${pad(day)}T${pad(h)}${pad(mi)}00`;
    const start = fmt(d.getFullYear(), d.getMonth(), d.getDate(), sh, sm);
    const end = fmt(d.getFullYear(), d.getMonth(), d.getDate(), eh, em);
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${start}/${end}`,
        details: description,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// WhatsApp pre-written message
function buildWhatsAppUrl({ phone, clientName, serviceName, date, startTime, endTime }) {
    const dateStr = new Date(date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const msg = `¡Hola ${clientName}! 👋 Te confirmamos tu turno en *M&O Estilistas*:\n\n📋 *Servicio:* ${serviceName}\n📅 *Fecha:* ${dateStr}\n⏰ *Horario:* ${startTime} a ${endTime}\n\n¡Te esperamos! 💇`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// ── Error/Success Toast interno ───────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm"
        >
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 font-medium flex-1">{message}</p>
            <button onClick={onDismiss} className="text-red-400 hover:text-red-600 shrink-0">
                <X size={14} />
            </button>
        </motion.div>
    );
}

// ── Pantalla de Éxito ─────────────────────────────────────────────────────────
function SuccessScreen({ booking, onClose }) {
    const gcUrl = buildGoogleCalendarUrl({
        title: `${booking.serviceName} — M&O Estilistas`,
        date: booking.date,
        startTime: booking.time,
        endTime: booking.endTime,
        description: `Turno reservado en M&O Estilistas para ${booking.clientName}.`,
    });
    const waUrl = buildWhatsAppUrl({
        phone: booking.salonWhatsapp || '5492337403819',
        clientName: booking.clientName,
        serviceName: booking.serviceName,
        date: booking.date,
        startTime: booking.time,
        endTime: booking.endTime,
    });
    const dateStr = new Date(booking.date).toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center px-6 pb-6 pt-2 text-center"
        >
            {/* Ícono animado */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 mt-2"
            >
                <Check size={38} className="text-green-500" strokeWidth={2.5} />
            </motion.div>

            <h2 className="text-2xl font-serif font-black text-zinc-800 mb-1">¡Turno Confirmado!</h2>
            <p className="text-zinc-500 text-sm mb-6">Te esperamos en M&O Estilistas.</p>

            {/* Tarjeta de resumen */}
            <div className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-5 text-left space-y-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {booking.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-zinc-800">{booking.clientName}</p>
                        <p className="text-zinc-500 text-xs">{booking.clientPhone}</p>
                    </div>
                </div>
                <div className="border-t border-rose-100 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Servicio</span>
                        <span className="font-semibold text-zinc-700">{booking.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Fecha</span>
                        <span className="font-semibold text-zinc-700 capitalize">{dateStr}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Horario</span>
                        <span className="font-bold text-rose-600 text-base">
                            {booking.time}
                            <span className="text-zinc-400 font-normal text-sm"> → {booking.endTime}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="w-full space-y-3">
                <a
                    href={gcUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                    <Calendar size={17} />
                    Agregar a Google Calendar
                    <ExternalLink size={13} className="opacity-70" />
                </a>
                <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1fbc59] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                    <Phone size={17} />
                    Confirmar por WhatsApp
                    <ExternalLink size={13} className="opacity-70" />
                </a>
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 font-medium text-sm transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </motion.div>
    );
}

// ── Pantalla de éxito para bloqueos ──────────────────────────────────────────
function BlockSuccessScreen({ booking, onClose }) {
    const dateStr = new Date(booking.date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center px-6 pb-6 pt-2 text-center"
        >
            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="w-20 h-20 bg-zinc-200 rounded-full flex items-center justify-center mb-5 mt-2"
            >
                <Check size={38} className="text-zinc-500" strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-2xl font-serif font-black text-zinc-800 mb-1">Horario Bloqueado</h2>
            <p className="text-zinc-500 text-sm mb-6">El espacio fue reservado correctamente.</p>
            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-5 text-left space-y-2 text-sm mb-6">
                {booking.clientName !== 'Administración' && (
                    <div className="flex justify-between"><span className="text-zinc-400">Motivo</span><span className="font-semibold text-zinc-700">{booking.clientName}</span></div>
                )}
                <div className="flex justify-between"><span className="text-zinc-400">Fecha</span><span className="font-semibold text-zinc-700 capitalize">{dateStr}</span></div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Horario</span>
                    <span className="font-bold text-zinc-700">{booking.time} <span className="text-zinc-400 font-normal">→ {booking.endTime}</span></span>
                </div>
            </div>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-sm transition-colors">
                Listo
            </button>
        </motion.div>
    );
}

// ── Modal Principal ───────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = { openTime: '08:00', closeTime: '19:00', slotInterval: 30, workDays: [1, 2, 3, 4, 5, 6] };
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function BookingModal({ service, onClose }) {
    const [step, setStep] = useState(1);       // 1, 2, 3, 'success', 'blockSuccess'
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [customDuration, setCustomDuration] = useState(60);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
    const [dayError, setDayError] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    const isBlocking = service.id === 999;
    const duration = isBlocking ? parseInt(customDuration) : service.duration;

    // Cargamos settings primero — los demás useEffects esperan a que estén listos
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    useEffect(() => {
        fetch(`${API}/api/settings`)
            .then(r => r.json())
            .then(d => { setSiteSettings(d); setSettingsLoaded(true); })
            .catch(() => setSettingsLoaded(true)); // si falla, usamos defaults
    }, []);

    useEffect(() => {
        if (settingsLoaded && step === 2 && date) fetchSlots(date, siteSettings);
    }, [step, date, settingsLoaded]);

    useEffect(() => {
        if (settingsLoaded && step === 2 && date && isBlocking) fetchSlots(date, siteSettings);
    }, [customDuration]);

    const fetchSlots = async (selectedDate, settings = siteSettings) => {
        setLoadingSlots(true); setTime(null);
        try {
            const y = selectedDate.getFullYear();
            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const d = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;
            const res = await fetch(`${API}/api/bookings?date=${dateStr}`);
            const existing = await res.json();
            const { openTime, closeTime, slotInterval } = settings;
            const allSlots = generateSlots(openTime, closeTime, slotInterval);
            const closeMin = timeToMinutes(closeTime);
            const now = new Date();
            const svcDur = isBlocking ? parseInt(customDuration) : service.duration;

            setSlots(allSlots.map(slotTime => {
                const slotStart = timeToMinutes(slotTime);
                const slotEnd = slotStart + svcDur;

                if (slotEnd > closeMin) return null;

                const slotDate = new Date(selectedDate);
                const [sh, sm] = slotTime.split(':').map(Number);
                slotDate.setHours(sh, sm, 0, 0);
                if (slotDate < now) return { time: slotTime, occupied: true };

                for (const b of existing) {
                    if (b.status === 'cancelled') continue;
                    const bStart = timeToMinutes(b.time);
                    const bEnd = bStart + (b.serviceDuration || 30);
                    if (slotStart < bEnd && slotEnd > bStart) return { time: slotTime, occupied: true };
                }
                return { time: slotTime, occupied: false };
            }).filter(Boolean));
        } catch {
            setSlots(generateSlots(settings.openTime, settings.closeTime, settings.slotInterval).map(t => ({ time: t, occupied: false })));
        } finally { setLoadingSlots(false); }
    };

    const handleDateChange = (newDate) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (newDate < today) { setDayError('No podés reservar en una fecha pasada.'); setDate(null); return; }
        if (!siteSettings.workDays.includes(newDate.getDay())) { setDayError('El local no atiende ese día.'); setDate(null); return; }
        setDayError(''); setDate(newDate);
    };

    const tileDisabled = ({ date: d, view }) => {
        if (view !== 'month') return false;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (d < today) return true;
        if (!siteSettings.workDays.includes(d.getDay())) return true;
        return false;
    };

    const handleNext = () => {
        if (step === 1 && !date) { setDayError('Seleccioná un día primero.'); return; }
        if (step < 3) setStep(step + 1);
    };
    const handleBack = () => { if (step > 1) setStep(step - 1); };

    const handleSubmit = async () => {
        if (!isBlocking && !formData.name.trim()) { setErrorMsg('Por favor ingresá tu nombre.'); return; }
        if (!isBlocking && !formData.phone.trim()) { setErrorMsg('Por favor ingresá tu teléfono.'); return; }

        setErrorMsg('');
        setSubmitting(true);

        // Construimos dateStr con valores locales del calendario — no hay conversión de timezone
        const y = date.getFullYear();
        const mo = String(date.getMonth() + 1).padStart(2, '0');
        const dy = String(date.getDate()).padStart(2, '0');
        const dateStr = `${y}-${mo}-${dy}`;
        const finalDuration = isBlocking ? parseInt(customDuration) : service.duration;
        const endTime = addMinutesToTime(time, finalDuration);
        const bookingData = {
            clientName: isBlocking ? (formData.name || 'Administración') : formData.name,
            clientPhone: isBlocking ? '0000000000' : formData.phone,
            clientEmail: isBlocking ? '' : formData.email,
            service: { ...service, duration: finalDuration },
            dateStr, date, time, endTime,
            status: isBlocking ? 'blocked' : 'confirmed'
        };
        try {
            const response = await fetch(`${API}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Bloquear horarios es acción de admin — el backend exige el token
                    ...(isBlocking ? { 'Authorization': `Bearer ${getToken()}` } : {}),
                },
                body: JSON.stringify(bookingData)
            });
            const data = await response.json();
            if (response.ok) {
                // Guardamos la info para la pantalla de éxito
                setConfirmedBooking({
                    clientName: bookingData.clientName,
                    clientPhone: bookingData.clientPhone,
                    serviceName: service.title,
                    date,
                    time,
                    endTime,
                    salonWhatsapp: siteSettings.salonWhatsapp || '5492337403819',
                });
                setStep(isBlocking ? 'blockSuccess' : 'success');
            } else {
                setErrorMsg(data.message || 'No se pudo completar la reserva.');
            }
        } catch {
            setErrorMsg('Error al conectar con el servidor. Intentá de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const endTimePreview = time ? addMinutesToTime(time, duration) : null;
    const isSuccess = step === 'success' || step === 'blockSuccess';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header — se oculta en pantalla de éxito */}
                    {!isSuccess && (
                        <>
                            <div className={`${isBlocking ? 'bg-zinc-800' : 'bg-rose-500'} p-6 flex justify-between items-start text-white shrink-0`}>
                                <div>
                                    <h2 className="text-xl font-serif font-bold">{isBlocking ? 'Bloquear Horario' : 'Reservar Turno'}</h2>
                                    <p className={`${isBlocking ? 'text-zinc-400' : 'text-rose-100'} text-sm mt-1`}>
                                        {service.title} • {isBlocking ? 'Admin' : `${service.priceFrom ? 'desde ' : ''}$${Number(service.price).toLocaleString('es-AR')}`}
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="flex bg-rose-50 h-1.5 shrink-0">
                                <div className={`${isBlocking ? 'bg-zinc-600' : 'bg-rose-500'} transition-all duration-300`}
                                    style={{ width: `${(typeof step === 'number' ? step / 3 : 1) * 100}%` }} />
                            </div>
                        </>
                    )}

                    {/* Éxito */}
                    {isSuccess && confirmedBooking && (
                        <div className="overflow-y-auto">
                            {step === 'success'
                                ? <SuccessScreen booking={confirmedBooking} onClose={onClose} />
                                : <BlockSuccessScreen booking={confirmedBooking} onClose={onClose} />
                            }
                        </div>
                    )}

                    {/* Flujo normal */}
                    {!isSuccess && (
                        <>
                            {/* Banner de error inline */}
                            <AnimatePresence>
                                {errorMsg && <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg('')} />}
                            </AnimatePresence>

                            <div className="p-6 flex-grow overflow-y-auto">

                                {/* Paso 1: Fecha */}
                                {step === 1 && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                                        <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                                            <Calendar size={20} className={isBlocking ? 'text-zinc-600' : 'text-rose-500'} /> Elegí el día
                                        </h3>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {DAY_NAMES.map((name, i) => {
                                                const active = siteSettings.workDays.includes(i);
                                                return (
                                                    <span key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${active ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-zinc-100 text-zinc-300 line-through'}`}>
                                                        {name}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <div className={`calendar-container p-2 bg-white rounded-xl border ${isBlocking ? 'border-zinc-200' : 'border-rose-100'} shadow-sm`}>
                                            <CalendarReact onChange={handleDateChange} value={date} minDate={new Date()} tileDisabled={tileDisabled} className="w-full border-none font-sans" />
                                        </div>
                                        {dayError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {dayError}</p>}
                                        {date && !dayError && (
                                            <p className="text-center text-sm text-zinc-400">
                                                Seleccionado: <span className={`font-bold ${isBlocking ? 'text-zinc-800' : 'text-rose-600'}`}>
                                                    {date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </span>
                                            </p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Paso 2: Hora */}
                                {step === 2 && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                                                <Clock size={20} className={isBlocking ? 'text-zinc-600' : 'text-rose-500'} />
                                                {isBlocking ? 'Hora de Inicio' : 'Elegí el horario'}
                                            </h3>
                                            {!isBlocking && <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">{service.duration} min</span>}
                                        </div>

                                        {isBlocking && (
                                            <div className="space-y-2 pb-4 border-b border-zinc-100">
                                                <p className="text-sm font-bold text-zinc-700">Duración del Bloqueo</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {[30, 60, 90, 120, 180, 240, 480].map(mins => (
                                                        <button key={mins} onClick={() => setCustomDuration(mins)}
                                                            className={`px-3 py-2 text-xs rounded-md border font-medium transition-colors ${customDuration === mins ? 'bg-zinc-700 text-white border-zinc-700' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}>
                                                            {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" value={customDuration} onChange={e => setCustomDuration(e.target.value)}
                                                        className="w-20 px-2 py-1 border rounded text-sm text-center" />
                                                    <span className="text-xs text-zinc-400">minutos personalizados</span>
                                                </div>
                                            </div>
                                        )}

                                        {loadingSlots ? (
                                            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-400" /></div>
                                        ) : (
                                            <div className="grid grid-cols-4 gap-2">
                                                {slots.map(({ time: slotTime, occupied }) => (
                                                    <button key={slotTime} onClick={() => !occupied && setTime(slotTime)} disabled={occupied}
                                                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${occupied ? 'bg-zinc-100 text-zinc-300 border-zinc-100 cursor-not-allowed line-through'
                                                                : time === slotTime
                                                                    ? (isBlocking ? 'bg-zinc-800 text-white border-zinc-800 scale-105 shadow-md' : 'bg-rose-500 text-white border-rose-500 scale-105 shadow-md')
                                                                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-rose-300 hover:bg-rose-50'
                                                            }`}>
                                                        {slotTime}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {time && (
                                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                                className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium ${isBlocking ? 'bg-zinc-50 border-zinc-200 text-zinc-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                                <Clock size={16} className="shrink-0" />
                                                <span>Turno de <strong>{time}</strong> a <strong>{endTimePreview}</strong> ({duration} min)</span>
                                            </motion.div>
                                        )}
                                        {!time && !loadingSlots && (
                                            <p className="text-xs text-center text-amber-500 flex items-center justify-center gap-1">
                                                <AlertCircle size={12} /> Seleccioná un horario para continuar.
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-zinc-400 justify-center">
                                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-zinc-200 inline-block" /> Disponible</span>
                                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-zinc-100 inline-block" /> Ocupado</span>
                                            <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${isBlocking ? 'bg-zinc-800' : 'bg-rose-500'} inline-block`} /> Elegido</span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Paso 3: Datos */}
                                {step === 3 && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                        <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                                            <User size={20} className={isBlocking ? 'text-zinc-600' : 'text-rose-500'} />
                                            {isBlocking ? 'Motivo del Bloqueo' : 'Tus Datos'}
                                        </h3>
                                        <form id="booking-form" onSubmit={e => e.preventDefault()} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-1">{isBlocking ? 'Razón (ej: Dentista)' : 'Nombre Completo'}</label>
                                                <input type="text" required={!isBlocking}
                                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                                                    placeholder={isBlocking ? 'Opcional' : 'Ej: Juan Pérez'}
                                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            {!isBlocking && (
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono (WhatsApp)</label>
                                                    <input type="tel" required
                                                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                                                        placeholder="Ej: 0412 345 678"
                                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                                </div>
                                            )}
                                            {!isBlocking && (
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                                                        Email <span className="text-zinc-400 font-normal">(opcional — para recibir confirmación)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                                        <input type="email"
                                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                                                            placeholder="tu@email.com"
                                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`p-4 rounded-xl text-sm space-y-1.5 border ${isBlocking ? 'bg-zinc-50 border-zinc-200 text-zinc-600' : 'bg-rose-50 border-rose-100 text-zinc-600'}`}>
                                                <p><strong>Servicio:</strong> {service.title}</p>
                                                <p><strong>Fecha:</strong> {date?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                                <p><strong>Inicio:</strong> {time}</p>
                                                <p><strong>Fin:</strong> <span className={`font-semibold ${isBlocking ? 'text-zinc-700' : 'text-rose-600'}`}>{endTimePreview}</span></p>
                                                <p><strong>Duración:</strong> {duration} min</p>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center shrink-0">
                                {step > 1
                                    ? <button onClick={handleBack} className="text-zinc-500 hover:text-zinc-800 font-medium text-sm flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
                                        <ChevronLeft size={16} /> Volver
                                    </button>
                                    : <div />
                                }
                                {step < 3 ? (
                                    <button onClick={handleNext} disabled={step === 2 && !time}
                                        className={`font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 ${isBlocking ? 'bg-zinc-800 hover:bg-zinc-900 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}>
                                        Siguiente <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} disabled={submitting}
                                        className={`${isBlocking ? 'bg-zinc-700 hover:bg-zinc-800' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:opacity-60`}>
                                        {submitting
                                            ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Reservando...</>
                                            : <><Check size={18} /> {isBlocking ? 'Confirmar Bloqueo' : 'Confirmar Reserva'}</>
                                        }
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}