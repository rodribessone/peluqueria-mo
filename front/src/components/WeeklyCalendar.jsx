import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Phone, Calendar, X, Lock, AlertTriangle } from 'lucide-react';
import { API, apiFetch } from '../utils/api';

export default function WeeklyCalendar({ bookings, onBookingCancelled }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

    const handleCancel = async () => {
        if (!selectedBooking) return;
        setCancelling(true);
        try {
            const res = await apiFetch(`/api/bookings/${selectedBooking._id}/cancel`, {
                method: 'PATCH'
            });
            if (res.ok) {
                setSelectedBooking(null);
                setConfirmCancel(false);
                onBookingCancelled && onBookingCancelled();
            } else {
                const data = await res.json();
                alert(data.message || 'Error al cancelar.');
            }
        } catch {
            alert('Error de conexión.');
        } finally {
            setCancelling(false);
        }
    };

    const isBlocked = (b) => b.serviceName === '🚫 HORARIO BLOQUEADO';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-100 bg-zinc-50">
                <button onClick={prevWeek} className="p-2 hover:bg-white rounded-full transition-colors text-zinc-500">
                    <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-bold text-zinc-800 font-serif capitalize">
                    {format(startDate, "MMMM yyyy", { locale: es })}
                </h2>
                <button onClick={nextWeek} className="p-2 hover:bg-white rounded-full transition-colors text-zinc-500">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Grilla */}
            <div className="grid grid-cols-7 divide-x divide-zinc-100 min-h-[400px]">
                {weekDays.map((day) => {
                    const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                    const dayBookings = bookings.filter(b =>
                        b.status !== 'cancelled' && (b.dateStr === dayStr || (b.date && isSameDay(parseISO(b.date), day)))
                    );
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={day.toString()} className={`flex flex-col ${isToday ? 'bg-rose-50/30' : ''}`}>
                            <div className="p-3 text-center border-b border-zinc-50">
                                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">
                                    {format(day, "EEE", { locale: es })}
                                </p>
                                <div className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full mx-auto ${isToday ? 'bg-rose-500 text-white' : 'text-zinc-700'}`}>
                                    {format(day, "d")}
                                </div>
                            </div>
                            <div className="flex-1 p-2 space-y-2">
                                {dayBookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        onClick={() => { setSelectedBooking(booking); setConfirmCancel(false); }}
                                        className={`p-2 rounded-lg border shadow-sm text-xs hover:shadow-md transition-shadow cursor-pointer group ${isBlocked(booking)
                                                ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                                                : 'bg-white border-rose-100 hover:bg-rose-50'
                                            }`}
                                    >
                                        <div className={`font-bold mb-1 flex items-center gap-1 ${isBlocked(booking) ? 'text-zinc-500' : 'text-rose-600'}`}>
                                            {isBlocked(booking) ? <Lock size={9} /> : <Clock size={10} />}
                                            {booking.time}
                                        </div>
                                        {!isBlocked(booking) && (
                                            <div className="font-medium text-zinc-800 truncate">{booking.clientName}</div>
                                        )}
                                        <div className="text-zinc-400 truncate text-[10px]">{booking.serviceName}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Detalle */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => { setSelectedBooking(null); setConfirmCancel(false); }}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
                        onClick={e => e.stopPropagation()}>

                        <div className={`${isBlocked(selectedBooking) ? 'bg-zinc-700' : 'bg-rose-500'} p-4 text-white flex justify-between items-start`}>
                            <h3 className="font-serif font-bold text-lg">
                                {isBlocked(selectedBooking) ? 'Horario Bloqueado' : 'Detalle del Turno'}
                            </h3>
                            <button onClick={() => { setSelectedBooking(null); setConfirmCancel(false); }}
                                className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            {!isBlocked(selectedBooking) && (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 font-bold text-xl">
                                        {selectedBooking.clientName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-800 text-lg">{selectedBooking.clientName}</p>
                                        <p className="text-zinc-500 text-sm flex items-center gap-1">
                                            <Phone size={12} /> {selectedBooking.clientPhone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-zinc-100 pt-4 space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400 flex items-center gap-2"><Clock size={14} /> Servicio:</span>
                                    <span className="font-medium text-zinc-700 bg-zinc-100 px-2 py-1 rounded">{selectedBooking.serviceName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400 flex items-center gap-2"><Calendar size={14} /> Fecha:</span>
                                    <span className="font-medium text-zinc-700 capitalize">
                                        {selectedBooking.dateStr
                                            ? new Date(selectedBooking.dateStr + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
                                            : selectedBooking.date ? format(parseISO(selectedBooking.date), "EEEE d 'de' MMMM", { locale: es }) : '—'
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400 flex items-center gap-2"><Clock size={14} /> Horario:</span>
                                    <span className={`font-bold text-lg ${isBlocked(selectedBooking) ? 'text-zinc-600' : 'text-rose-600'}`}>
                                        {selectedBooking.time}
                                        {selectedBooking.endTime && (
                                            <span className="text-zinc-400 font-normal text-sm ml-1">
                                                → {new Date(selectedBooking.endTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Panel de confirmación de cancelación */}
                            {confirmCancel ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <AlertTriangle size={16} />
                                        <p className="font-bold text-sm">¿Confirmás la cancelación?</p>
                                    </div>
                                    <p className="text-xs text-red-500">
                                        {isBlocked(selectedBooking)
                                            ? 'Se va a liberar este horario bloqueado.'
                                            : `Se cancelará el turno de ${selectedBooking.clientName}.`
                                        }
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setConfirmCancel(false)}
                                            className="flex-1 py-2 rounded-lg border border-zinc-200 text-zinc-500 text-xs font-medium hover:bg-zinc-50"
                                        >
                                            Volver
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={cancelling}
                                            className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-60"
                                        >
                                            {cancelling
                                                ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                                                : <><X size={12} /> Cancelar turno</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-2 flex gap-3">
                                    {!isBlocked(selectedBooking) && (
                                        <a href={`https://wa.me/${selectedBooking.clientPhone.replace(/\D/g, '')}`}
                                            target="_blank" rel="noreferrer"
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-center text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                                            <Phone size={16} /> WhatsApp
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setConfirmCancel(true)}
                                        className="flex-1 bg-red-50 text-red-500 hover:bg-red-100 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                                        <X size={16} /> {isBlocked(selectedBooking) ? 'Liberar horario' : 'Cancelar'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}