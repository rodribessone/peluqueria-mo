import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bookingRoutes from './routes/bookings.js';
import serviceRoutes from './routes/services.js';
import productRoutes from './routes/products.js';
import settingsRoutes from './routes/settings.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// En producción setear CORS_ORIGIN en .env (ej: https://tudominio.com).
// Sin configurar acepta cualquier origen (cómodo para desarrollo).
const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : true;
app.use(cors({ origin: corsOrigin }));

// Solo la ruta de IA necesita bodies grandes (la foto viaja en base64)
app.use('/api/ai', express.json({ limit: '50mb' }), aiRoutes);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => res.json({ message: '✂️ API Peluquería M&O - Online' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('📦 MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`));
  })
  .catch(err => { console.error(err); process.exit(1); });