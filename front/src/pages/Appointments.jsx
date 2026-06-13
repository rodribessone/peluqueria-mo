import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';
import { Calendar as CalendarIcon, Filter, Loader2 } from 'lucide-react';

import { API } from '../utils/api';

export default function Appointments() {
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('todos');

    const categories = [
        { id: 'todos', label: 'Todos' },
        { id: 'corte', label: 'Cortes' },
        { id: 'color', label: 'Color' },
        { id: 'tratamiento', label: 'Tratamientos' },
        { id: 'peinado', label: 'Peinados' },
        { id: 'masculino', label: 'Masculino' },
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/services`);
            if (!res.ok) throw new Error('Error al cargar servicios');
            const data = await res.json();
            setServices(data);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los servicios. Intentá de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = activeFilter === 'todos'
        ? services
        : services.filter(s => s.category === activeFilter);

    return (
        <div className="min-h-screen bg-rose-50/10 pb-20 relative">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-rose-100 py-12 mb-12 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-serif font-black text-rose-600 mb-4 tracking-tight flex items-center justify-center gap-3">
                        <CalendarIcon className="text-rose-400" size={32} />
                        Reservá tu Turno
                    </h1>
                    <p className="text-zinc-500 font-light text-lg max-w-2xl mx-auto">
                        Seleccioná el servicio que estás buscando y elegí el horario que mejor te quede.
                    </p>
                </div>
            </div>

            {/* Grid de Servicios */}
            <div className="max-w-7xl mx-auto px-6">

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-zinc-800 font-serif">Nuestros Servicios</h2>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter size={14} className="text-zinc-400" />
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.id)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${activeFilter === cat.id
                                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-rose-300 hover:text-rose-500'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Estados: Cargando / Error / Tarjetas */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
                        <Loader2 size={40} className="animate-spin text-rose-400" />
                        <p className="text-sm font-medium">Cargando servicios...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
                        <p className="text-red-400 font-medium">{error}</p>
                        <button
                            onClick={fetchServices}
                            className="mt-4 text-sm text-rose-500 hover:text-rose-700 underline"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-zinc-400 font-medium">No hay servicios en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {filteredServices.map((service) => (
                            <ServiceCard
                                key={service._id}
                                service={{ ...service, id: service._id }}
                                onSelect={setSelectedService}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Modal de Reserva */}
            {selectedService && (
                <BookingModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                />
            )}

            <Footer />
        </div>
    );
}