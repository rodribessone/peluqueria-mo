import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, RotateCcw, Download, ChevronRight, Camera, Wand2, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import { API } from '../utils/api';

// Ejemplos de prompts para inspirar al usuario
const PROMPT_EXAMPLES = [
    'Pelo corto al hombro, color rubio platinado con mechas',
    'Corte bob moderno, castaño oscuro con reflejos cobrizos',
    'Pelo largo y lacio, negro azabache',
    'Pixie cut, rojo vibrante',
    'Ondas suaves, castaño con mechas balayage doradas',
    'Degradado corto en los costados, arriba largo y rizado',
];

export default function AIPreview() {
    const [phase, setPhase] = useState('upload');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [gender, setGender] = useState('female');
    const [resultUrl, setResultUrl] = useState(null);
    const [remaining, setRemaining] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // ── Manejo de foto ────────────────────────────────────────────────────────
    const processFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Por favor subí una imagen (JPG, PNG, WEBP).');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('La imagen es demasiado grande. Máximo 10MB.');
            return;
        }
        setError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhoto(e.target.result);       // base64 completo (con prefijo data:...)
            setPhotoPreview(e.target.result);
            setPhase('configure');
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    }, [processFile]);

    const handleFileInput = (e) => processFile(e.target.files[0]);

    // ── Llamada a la IA ───────────────────────────────────────────────────────
    const handleGenerate = async () => {
        if (!prompt.trim()) { setError('Describí el estilo que querés antes de continuar.'); return; }
        setPhase('loading');
        setError('');
        try {
            const res = await fetch(`${API}/api/ai/transform`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: photo,
                    prompt: prompt.trim(),  // el backend lo traduce a inglés automáticamente
                    gender,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error generando imagen.');
            setResultUrl(data.imageUrl);
            if (typeof data.remaining === 'number') setRemaining(data.remaining);
            setPhase('result');
        } catch (err) {
            setError(err.message);
            setPhase('configure');
        }
    };

    const handleReset = () => {
        setPhase('upload');
        setPhoto(null);
        setPhotoPreview(null);
        setResultUrl(null);
        setError('');
        setPrompt('');
    };

    return (
        <div className="min-h-screen bg-zinc-950 font-sans">
            <div className="relative">
                {/* Navbar con fondo oscuro */}
                <div className="bg-zinc-950 border-b border-zinc-800">
                    <Navbar />
                </div>

                {/* Hero header */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-950/40 via-zinc-950 to-zinc-950" />
                    <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
                        <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            <Sparkles size={12} />
                            Powered by IA
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 leading-tight">
                            Visualizá tu nuevo look
                            <span className="block text-rose-400">antes de sentarte en la silla</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                            Subí una foto tuya, elegí el color y el corte que querés,
                            y la IA te muestra cómo podrías quedar.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pb-20">

                {/* ── FASE: UPLOAD ─────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {phase === 'upload' && (
                        <motion.div key="upload"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 ${dragOver
                                        ? 'border-rose-400 bg-rose-500/10 scale-[1.02]'
                                        : 'border-zinc-700 hover:border-rose-500/50 bg-zinc-900/50 hover:bg-zinc-900'
                                    }`}
                            >
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />

                                <div className="flex flex-col items-center gap-5">
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-rose-500/20' : 'bg-zinc-800'}`}>
                                        <Camera size={36} className={dragOver ? 'text-rose-400' : 'text-zinc-400'} />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-xl mb-2">
                                            {dragOver ? 'Soltá la foto acá' : 'Subí tu foto'}
                                        </p>
                                        <p className="text-zinc-400 text-sm">
                                            Arrastrá y soltá, o hacé click para elegir
                                        </p>
                                        <p className="text-zinc-600 text-xs mt-2">JPG, PNG, WEBP — máx. 10MB</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="w-16 h-px bg-zinc-700" />
                                        <span className="text-zinc-500 text-xs uppercase tracking-wider">o</span>
                                        <span className="w-16 h-px bg-zinc-700" />
                                    </div>
                                    <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 text-sm">
                                        <Upload size={16} /> Elegir foto
                                    </button>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                {[
                                    { icon: '📸', title: 'Foto clara', desc: 'Buena iluminación y el rostro visible' },
                                    { icon: '🎯', title: 'De frente', desc: 'Mirando a la cámara, sin lentes de sol' },
                                    { icon: '✂️', title: 'Pelo visible', desc: 'Que se vea bien tu pelo actual' },
                                ].map((tip, i) => (
                                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                                        <div className="text-2xl mb-2">{tip.icon}</div>
                                        <p className="text-white text-sm font-semibold">{tip.title}</p>
                                        <p className="text-zinc-500 text-xs mt-1">{tip.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm text-center mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                    {error}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* ── FASE: CONFIGURAR ─────────────────────────────────── */}
                    {phase === 'configure' && (
                        <motion.div key="configure"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Preview de la foto */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center gap-4">
                                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Tu foto</p>
                                    <img src={photoPreview} alt="Tu foto"
                                        className="w-full max-w-[280px] h-72 object-cover rounded-2xl border border-zinc-700" />
                                    <button onClick={handleReset}
                                        className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1.5 transition-colors">
                                        <RotateCcw size={12} /> Cambiar foto
                                    </button>
                                </div>

                                {/* Configuración */}
                                <div className="space-y-4">

                                    {/* Género */}
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                                        <p className="text-white text-sm font-bold mb-3">Género</p>
                                        <div className="flex gap-3">
                                            {[['female', 'Femenino'], ['male', 'Masculino']].map(([val, label]) => (
                                                <button key={val} onClick={() => setGender(val)}
                                                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${gender === val
                                                            ? 'bg-rose-500 border-rose-500 text-white'
                                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                                        }`}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Descripción libre */}
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                                        <p className="text-white text-sm font-bold">Describí el estilo que querés</p>
                                        <textarea
                                            value={prompt}
                                            onChange={e => setPrompt(e.target.value)}
                                            placeholder="Ej: quiero el pelo corto al hombro, color rubio platinado con mechas y ondas suaves..."
                                            rows={4}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-rose-500 resize-none transition-colors"
                                        />
                                        <p className="text-zinc-600 text-xs">
                                            Mientras más detallado, mejor resultado. Podés describir color, largo, corte, textura, etc.
                                        </p>
                                    </div>

                                    {/* Ejemplos de inspiración */}
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <Lightbulb size={12} /> Ideas para inspirarte
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {PROMPT_EXAMPLES.map((example, i) => (
                                                <button key={i} onClick={() => setPrompt(example)}
                                                    className="text-left text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 px-3 py-2 rounded-lg border border-zinc-800 hover:border-rose-500/20 transition-all">
                                                    "{example}"
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                    {error}
                                </p>
                            )}

                            <button onClick={handleGenerate} disabled={!prompt.trim()}
                                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-lg transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-[0.98]">
                                <Wand2 size={22} />
                                Generar mi nuevo look
                                <ChevronRight size={20} />
                            </button>

                            <p className="text-zinc-600 text-xs text-center">
                                El procesamiento puede tardar entre 15 y 40 segundos.
                            </p>
                        </motion.div>
                    )}

                    {/* ── FASE: LOADING ─────────────────────────────────────── */}
                    {phase === 'loading' && (
                        <motion.div key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 gap-8">

                            {/* Spinner con foto */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800">
                                    <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-500 animate-spin" />
                                <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-rose-300/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-white font-bold text-xl">La IA está trabajando...</p>
                                <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                                    "<span className="text-rose-400 italic">{prompt}</span>"
                                </p>
                                <p className="text-zinc-600 text-xs mt-2">Esto puede tardar hasta 40 segundos</p>
                            </div>

                            {/* Barra de progreso animada */}
                            <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-rose-500 to-rose-300 rounded-full"
                                    initial={{ width: '5%' }}
                                    animate={{ width: '90%' }}
                                    transition={{ duration: 35, ease: 'easeOut' }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* ── FASE: RESULTADO ───────────────────────────────────── */}
                    {phase === 'result' && resultUrl && (
                        <motion.div key="result"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="space-y-6">

                            <div className="text-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                    className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold px-4 py-2 rounded-full mb-3">
                                    ✨ ¡Listo! Así podrías quedar
                                </motion.div>
                            </div>

                            {/* Comparación antes/después */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider text-center">Antes</p>
                                    <img src={photoPreview} alt="Antes"
                                        className="w-full h-80 object-cover rounded-2xl border border-zinc-700" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-rose-400 text-xs font-bold uppercase tracking-wider text-center">Después ✨</p>
                                    <img src={resultUrl} alt="Resultado IA"
                                        className="w-full h-80 object-cover rounded-2xl border border-rose-500/30 shadow-lg shadow-rose-500/10" />
                                </div>
                            </div>

                            {/* Info del estilo aplicado */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center text-sm">
                                <p className="text-zinc-500 text-xs mb-1">Estilo generado</p>
                                <p className="text-zinc-300 italic">"{prompt}"</p>
                            </div>

                            {/* Disclaimer */}
                            <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                                <span className="text-lg shrink-0">💡</span>
                                <div>
                                    <p className="text-amber-200/90 text-sm font-semibold mb-0.5">Resultado ilustrativo</p>
                                    <p className="text-zinc-400 text-xs leading-relaxed">
                                        Esta imagen es una aproximación generada por IA. El resultado real depende de tu tipo de pelo,
                                        su estado actual y el trabajo del estilista, que te va a asesorar en persona para lograr el mejor look.
                                    </p>
                                </div>
                            </div>

                            {remaining !== null && (
                                <p className="text-zinc-600 text-xs text-center">
                                    Te {remaining === 1 ? 'queda' : 'quedan'} <span className="text-rose-400 font-bold">{remaining}</span> {remaining === 1 ? 'generación' : 'generaciones'} por hoy
                                </p>
                            )}

                            {/* Acciones */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a href={resultUrl} download="mi-nuevo-look.png" target="_blank" rel="noreferrer"
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 border border-zinc-700">
                                    <Download size={18} /> Descargar imagen
                                </a>
                                <button onClick={() => setPhase('configure')}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 border border-zinc-700">
                                    <Wand2 size={18} /> Probar otro estilo
                                </button>
                                <button onClick={handleReset}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 border border-zinc-700">
                                    <RotateCcw size={18} /> Nueva foto
                                </button>
                            </div>

                            {/* CTA para reservar */}
                            <div className="bg-gradient-to-r from-rose-500/10 to-rose-600/5 border border-rose-500/20 rounded-2xl p-6 text-center space-y-3">
                                <p className="text-white font-bold text-lg">¿Te gustó cómo quedás?</p>
                                <p className="text-zinc-400 text-sm">Reservá tu turno y hacelo realidad con nuestros estilistas.</p>
                                <a href="/turnos"
                                    className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-xl transition-colors text-sm">
                                    Reservar turno ahora <ChevronRight size={16} />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}