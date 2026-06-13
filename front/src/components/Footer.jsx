import React from 'react';
import { Heart, Scissors } from 'lucide-react';

// dark: variante para páginas de fondo oscuro (ej: el probador con IA)
export default function Footer({ dark = false }) {
    return (
        <footer className={`border-t mt-auto py-10 ${dark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-rose-100'}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Marca */}
                <div className="text-center md:text-left">
                    <h3 className={`text-xl font-serif font-black flex items-center justify-center md:justify-start gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}>
                        <Scissors size={18} className="text-rose-500" /> Peluquería M&O
                    </h3>
                    <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Tu estilo, nuestra pasión
                    </p>
                </div>

                {/* Créditos del dev */}
                <div className="text-center md:text-right">
                    <p className={`text-xs font-medium flex items-center justify-center md:justify-end gap-1.5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Hecho con <Heart size={12} className="text-rose-500 fill-current animate-pulse" /> by
                        <a
                            href="https://rodribessone.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-black transition-colors hover:text-rose-500 ${dark ? 'text-white' : 'text-zinc-900'}`}
                        >
                            Rodrigo Bessone
                        </a>
                    </p>
                    <p className={`text-[10px] mt-1 font-mono font-medium ${dark ? 'text-zinc-600' : 'text-zinc-300'}`}>
                        © {new Date().getFullYear()} · Todos los derechos reservados
                    </p>
                </div>
            </div>
        </footer>
    );
}
