import React from 'react';
import { Clock, Scissors } from 'lucide-react';

export default function ServiceCard({ service, onSelect }) {
  const { title, description, price, priceFrom, duration, image } = service;

  const formattedPrice = `$${Number(price).toLocaleString('es-AR')}`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 group flex flex-col h-full">

      {/* Imagen */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-rose-600 shadow-sm border border-rose-100">
          {priceFrom && <span className="text-[10px] font-medium text-zinc-400 mr-1">desde</span>}
          {formattedPrice}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-zinc-900 mb-2 group-hover:text-rose-600 transition-colors">
          {title}
        </h3>

        <p className="text-zinc-500 text-sm mb-6 leading-relaxed flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <Clock size={14} />
            {duration} min
          </div>

          <button
            onClick={() => onSelect(service)}
            className="bg-zinc-900 hover:bg-rose-600 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95"
          >
            <Scissors size={14} />
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}