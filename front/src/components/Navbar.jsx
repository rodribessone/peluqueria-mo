import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors, Calendar, ShoppingBag, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Inicio', path: '/', icon: <Scissors size={18} /> },
        { name: 'Turnos', path: '/turnos', icon: <Calendar size={18} /> },
        { name: 'Tienda', path: '/tienda', icon: <ShoppingBag size={18} /> },
        { name: 'Probá IA', path: '/preview', icon: <Sparkles size={18} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-serif font-bold text-rose-500 tracking-tight">
                            <span className="text-zinc-400 text-sm font-sans font-medium">Peluquería</span> M&O
                        </span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            link.path === '/preview'
                                ? <Link key={link.path} to={link.path}
                                    className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all ${isActive(link.path)
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                                        }`}>
                                    {link.icon} {link.name}
                                </Link>
                                : <Link key={link.path} to={link.path}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive(link.path) ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-400'
                                        }`}>
                                    {link.icon} {link.name}
                                </Link>
                        ))}
                    </div>

                    {/* Mobile button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-500 hover:text-rose-500 p-2 focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile panel */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-rose-50 shadow-lg absolute w-full left-0">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {links.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                                className={`block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${isActive(link.path) ? 'text-rose-600 bg-rose-50' : 'text-zinc-600 hover:bg-rose-50 hover:text-rose-500'
                                    }`}>
                                {link.icon} {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}