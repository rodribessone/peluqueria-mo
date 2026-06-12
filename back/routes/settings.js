import express from 'express';
import Settings from '../models/Settings.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

const DEFAULT = {
    key: 'main',
    openTime: '08:00',
    closeTime: '19:00',
    slotInterval: 30,
    workDays: [1, 2, 3, 4, 5, 6],
    salonPhone: '+54 9 2337 403819',
    salonWhatsapp: '5492337403819',
};

// GET: público (el BookingModal lo necesita)
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'main' });
        if (!settings) settings = await Settings.create(DEFAULT);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: solo admin
router.put('/', auth, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            { key: 'main' },
            { ...req.body, key: 'main' },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;