import express from 'express';
import Replicate from 'replicate';

const router = express.Router();

// ── Rate limit: 3 generaciones por IP por día ─────────────────────────────────
const DAILY_LIMIT = 3;
const usageMap = new Map(); // ip -> { count, date }

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function checkRateLimit(ip) {
    const today = todayStr();
    const entry = usageMap.get(ip);

    if (!entry || entry.date !== today) {
        usageMap.set(ip, { count: 1, date: today });
        return { allowed: true, remaining: DAILY_LIMIT - 1 };
    }
    if (entry.count >= DAILY_LIMIT) {
        return { allowed: false, remaining: 0 };
    }
    entry.count++;
    return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

// Limpieza diaria del mapa para que no crezca infinito
setInterval(() => {
    const today = todayStr();
    for (const [ip, entry] of usageMap.entries()) {
        if (entry.date !== today) usageMap.delete(ip);
    }
}, 1000 * 60 * 60); // cada hora

// ── Traducción ES → EN (MyMemory, gratis, sin API key) ───────────────────────
async function translateToEnglish(text) {
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        const translated = data?.responseData?.translatedText;
        if (translated && typeof translated === 'string' && translated.trim()) {
            console.log(`🌐 Traducido: "${text}" → "${translated}"`);
            return translated;
        }
        return text; // fallback
    } catch {
        console.log('⚠️ Traducción falló, usando texto original');
        return text; // si falla la traducción, mandamos el original
    }
}

// ── POST: Transformar el pelo de la foto ──────────────────────────────────────
router.post('/transform', async (req, res) => {
    try {
        // Rate limit por IP. req.ip usa la conexión real (no confía en X-Forwarded-For,
        // que cualquiera puede falsear). Si deployás detrás de un proxy (Render, Railway,
        // etc.), activá app.set('trust proxy', 1) en index.js para que req.ip lo respete.
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const limit = checkRateLimit(ip);

        if (!limit.allowed) {
            return res.status(429).json({
                message: 'Alcanzaste el límite de 3 imágenes por día. ¡Volvé mañana para probar más estilos!'
            });
        }

        const { imageBase64, prompt, hair_color, haircut, gender } = req.body;

        if (!imageBase64 || !prompt) {
            return res.status(400).json({ message: '⚠️ Faltan datos: se necesita imageBase64 y prompt.' });
        }

        // Traducir el prompt del usuario a inglés para mejores resultados
        const englishPrompt = await translateToEnglish(prompt);

        console.log('⏳ Enviando foto a la IA de Replicate...');
        console.log(`   Prompt: "${englishPrompt}" | Género: ${gender} | IP: ${ip} (${limit.remaining} restantes hoy)`);

        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        const output = await replicate.run(
            "flux-kontext-apps/change-haircut",
            {
                input: {
                    input_image: imageBase64,
                    prompt: englishPrompt,
                    hair_color: hair_color || 'No change',
                    haircut: haircut || 'No change',
                    gender: gender || 'female',
                    output_format: 'png'
                }
            }
        );

        console.log('✅ ¡La IA terminó el trabajo!');

        // Replicate v1.4+ puede devolver Streams — extraemos la URL
        let finalImageUrl = '';

        if (Array.isArray(output) && output.length > 0) {
            finalImageUrl = output[0].url ? output[0].url().href : String(output[0]);
        } else if (typeof output === 'string') {
            finalImageUrl = output;
        } else if (output && output.url) {
            finalImageUrl = output.url().href;
        } else {
            finalImageUrl = String(output);
        }

        console.log('✅ URL final:', finalImageUrl);

        res.json({ imageUrl: finalImageUrl, remaining: limit.remaining });

    } catch (error) {
        console.error('❌ Error en la IA:', error);
        res.status(500).json({ message: 'Error procesando la imagen con IA', error: error.message });
    }
});

export default router;