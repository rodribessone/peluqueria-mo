import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    openTime: { type: String, default: '08:00' },
    closeTime: { type: String, default: '19:00' },
    slotInterval: { type: Number, default: 30 },
    workDays: { type: [Number], default: [1, 2, 3, 4, 5, 6] },
    salonPhone: { type: String, default: '+54 9 2337 403819' },   // para WhatsApp
    salonWhatsapp: { type: String, default: '5492337403819' },    // formato internacional sin +
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;