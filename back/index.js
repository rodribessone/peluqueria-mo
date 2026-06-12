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

// En hosting con proxy adelante (Vercel, Render, Railway, etc.) setear TRUST_PROXY=1
// para que req.ip sea la IP real del visitante y no la del proxy.
// Localmente dejarlo apagado (un cliente podría falsear su IP con headers).
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

// Conexión a MongoDB cacheada. En Vercel (serverless) cada request puede
// arrancar la función de cero: si la conexión ya existe la reusamos en vez
// de reconectar, y si no, la abrimos una sola vez.
let dbPromise = null;
function connectDB() {
    if (!dbPromise) dbPromise = mongoose.connect(process.env.MONGO_URI);
    return dbPromise;
}

// Garantiza la conexión antes de tocar cualquier ruta
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Error conectando a MongoDB:', err);
        dbPromise = null; // permite reintentar en el próximo request
        res.status(500).json({ message: 'Error de conexión a la base de datos.' });
    }
});

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

// En Vercel no hay que escuchar un puerto — la plataforma invoca la app
// exportada por cada request. Localmente arrancamos el servidor clásico.
if (!process.env.VERCEL) {
    connectDB()
        .then(() => {
            console.log('📦 MongoDB conectado');
            app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`));
        })
        .catch(err => { console.error(err); process.exit(1); });
}

export default app;