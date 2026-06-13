import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { API, setToken } from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                navigate('/admin', { replace: true });
            } else {
                setError(data.message || 'Credenciales incorrectas.');
            }
        } catch {
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rose-50/30 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
                        <Scissors size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-serif font-black text-zinc-800">Peluquería M&O</h1>
                    <p className="text-zinc-500 text-sm mt-1">Panel de Administración</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
                    <h2 className="text-lg font-bold text-zinc-800 mb-6">Iniciar sesión</h2>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
                            <AlertCircle size={15} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                <input
                                    type="email" required autoComplete="email"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@peluqueria.com"
                                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Contraseña</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                <input
                                    type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-3 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                            {loading
                                ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Ingresando...</>
                                : 'Ingresar al panel'
                            }
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-400 mt-6">
                    Acceso exclusivo para administradores de Peluquería M&O
                </p>
            </div>
        </div>
    );
}