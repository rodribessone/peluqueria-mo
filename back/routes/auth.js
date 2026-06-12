import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email y contraseña requeridos.' });

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET)
        return res.status(500).json({ message: 'El servidor no está configurado correctamente. Verificá el archivo .env' });

    if (
        email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase() ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );

    res.json({ token, email });
});

// POST /api/auth/verify — para verificar si el token sigue válido
router.post('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true });
    } catch {
        res.status(403).json({ valid: false });
    }
});

export default router;