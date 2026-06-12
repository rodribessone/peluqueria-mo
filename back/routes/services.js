import express from 'express';
import Service from '../models/Service.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: público
router.get('/', async (req, res) => {
    try {
        const query = req.query.all === 'true' ? {} : { active: true };
        const services = await Service.find(query).sort({ order: 1, title: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST, PUT, DELETE: solo admin
router.post('/', auth, async (req, res) => {
    try {
        const service = new Service(req.body);
        const saved = await service.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Servicio no encontrado' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Servicio eliminado.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed inicial — solo admin
router.post('/seed/init', auth, async (req, res) => {
    try {
        const count = await Service.countDocuments();
        if (count > 0) return res.json({ message: 'Ya existen servicios, seed omitido.' });

        const defaultServices = [
            {
                title: "Corte & Estilo",
                price: 45,
                duration: 60,
                category: 'corte',
                description: "Asesoramiento de imagen, corte personalizado y peinado final con productos premium.",
                image: "https://images.unsplash.com/photo-1599351431202-6e0000a400a4?auto=format&fit=crop&q=80&w=800",
                order: 1
            },
            {
                title: "Coloración Completa",
                price: 120,
                duration: 180,
                category: 'color',
                description: "Color global con tinturas sin amoníaco. Incluye nutrición post-color.",
                image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
                order: 2
            },
            {
                title: "Balayage / Mechas",
                price: 180,
                duration: 240,
                category: 'color',
                description: "Técnica a mano alzada para un look natural y luminoso. Incluye matizado.",
                image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800",
                order: 3
            },
            {
                title: "Tratamiento Keratina",
                price: 90,
                duration: 120,
                category: 'tratamiento',
                description: "Alisado progresivo y antifrizz. Deja el pelo sedoso y brillante por meses.",
                image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
                order: 4
            },
            {
                title: "Corte Masculino",
                price: 35,
                duration: 45,
                category: 'masculino',
                description: "Degradado, clásico o moderno. Incluye lavado y perfilado de barba.",
                image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
                order: 5
            },
            {
                title: "Peinado Fiesta",
                price: 60,
                duration: 90,
                category: 'peinado',
                description: "Recogidos, ondas al agua o estilos para eventos especiales.",
                image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
                order: 6
            }
        ];

        await Service.insertMany(defaultServices);
        res.status(201).json({ message: `${defaultServices.length} servicios creados.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;