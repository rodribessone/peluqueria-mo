import jwt from 'jsonwebtoken';

// Chequeo no bloqueante: ¿la request viene con un token de admin válido?
// Para rutas públicas que devuelven más datos (o permiten más acciones) si sos admin.
export function isAdminRequest(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return false;
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch {
        res.status(403).json({ message: 'Token inválido o expirado.' });
    }
}