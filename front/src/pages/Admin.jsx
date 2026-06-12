import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { apiFetch, removeToken, API } from '../utils/api';
import {
    Calendar, Clock, User, Phone, Scissors, Lock, Settings,
    DollarSign, Timer, Pencil, Check, X, ToggleLeft, ToggleRight,
    ChevronDown, ChevronUp, ShoppingBag, Plus, Trash2, Tag,
    PackageX, Package, Image, AlertTriangle, SlidersHorizontal,
    TrendingUp, Search, Filter, BarChart2, Star, CalendarCheck,
    XCircle, ArrowUpRight, LogOut
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { clientWhatsAppUrl } from '../utils/whatsapp';

const EMPTY_SERVICE = { title: '', price: '', priceFrom: false, duration: 60, description: '', image: '', category: 'corte', active: true };
const SERVICE_CATS = [{ value: 'corte', label: 'Corte' }, { value: 'color', label: 'Color' }, { value: 'tratamiento', label: 'Tratamiento' }, { value: 'peinado', label: 'Peinado' }, { value: 'otro', label: 'Otro' }];

function ServiceModal({ service, onClose, onSave }) {
    const isEdit = !!service;
    const [form, setForm] = useState(isEdit
        ? { title: service.title, price: service.price, priceFrom: service.priceFrom || false, duration: service.duration, description: service.description, image: service.image || '', category: service.category || 'corte' }
        : { ...EMPTY_SERVICE }
    );
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        if (!form.title.trim() || !form.price) return alert('Nombre y precio son obligatorios.');
        setSaving(true);
        try {
            const url = isEdit ? `/api/services/${service._id}` : '/api/services';
            const method = isEdit ? 'PUT' : 'POST';
            const res = await apiFetch(url, { method, body: JSON.stringify({ ...form, price: Number(form.price), duration: Number(form.duration) }) });
            if (res.ok) onSave(await res.json(), isEdit);
            else alert('Error al guardar.');
        } catch { alert('Error de conexión.'); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-zinc-800 p-5 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-serif font-bold text-lg">{isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nombre *</label>
                        <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: Corte & Estilo" className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Precio ($) *</label>
                            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Duración (min)</label>
                            <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" />
                        </div>
                    </div>
                    <button onClick={() => set('priceFrom', !form.priceFrom)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.priceFrom ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                        {form.priceFrom ? '✓ Precio "desde" (varía según el pelo)' : 'Precio fijo'}
                    </button>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Categoría</label>
                        <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none bg-white">
                            {SERVICE_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Descripción</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Descripción breve del servicio..." className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">URL de imagen</label>
                        <input type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" />
                        {form.image && <img src={form.image} alt="preview" className="mt-2 w-full h-28 object-cover rounded-lg border border-zinc-100" onError={e => e.target.style.display = 'none'} />}
                    </div>
                </div>
                <div className="px-6 pb-6 pt-2 flex gap-3 shrink-0">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-zinc-500 text-sm font-medium hover:bg-zinc-50">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                        {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Check size={15} /> {isEdit ? 'Guardar' : 'Crear servicio'}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

const EMPTY_PRODUCT = { name: '', brand: '', description: '', price: '', category: 'shampoo', image: '', inStock: true, featured: false, promo: { active: false, label: '', originalPrice: '' } };
const CATEGORY_OPTIONS = [{ value: 'shampoo', label: 'Shampoo' }, { value: 'acondicionador', label: 'Acondicionador' }, { value: 'tratamiento', label: 'Tratamiento' }, { value: 'estilizado', label: 'Estilizado' }, { value: 'perfume', label: 'Perfume' }, { value: 'otro', label: 'Otro' }];

function ProductModal({ product, onClose, onSave }) {
    const isEdit = !!product;
    const [form, setForm] = useState(isEdit ? { ...product, promo: product.promo || { active: false, label: '', originalPrice: '' } } : { ...EMPTY_PRODUCT });
    const [saving, setSaving] = useState(false);
    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
    const setPromo = (key, val) => setForm(f => ({ ...f, promo: { ...f.promo, [key]: val } }));
    const handleSave = async () => {
        if (!form.name || !form.price) return alert('Nombre y precio son obligatorios.');
        setSaving(true);
        try {
            const url = isEdit ? `/api/products/${product._id}` : '/api/products';
            const res = await apiFetch(url, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify({ ...form, price: Number(form.price) }) });
            if (res.ok) onSave(await res.json(), isEdit); else alert('Error al guardar.');
        } catch { alert('Error de conexión.'); } finally { setSaving(false); }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-zinc-900 p-5 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-serif font-bold text-lg">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nombre *</label>
                            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Shampoo Nutritivo" className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" /></div>
                        <div><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Marca</label>
                            <input type="text" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Ej: Loreal" className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Categoría</label>
                            <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none bg-white">
                                {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                        <div><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Precio ($) *</label>
                            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Descripción</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Describí el producto..." className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none resize-none" /></div>
                    <div><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">URL de Imagen</label>
                        <input type="text" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none" /></div>
                    <div className="flex gap-3">
                        <button onClick={() => set('inStock', !form.inStock)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.inStock ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                            {form.inStock ? <Package size={15} /> : <PackageX size={15} />} {form.inStock ? 'En stock' : 'Sin stock'}</button>
                        <button onClick={() => set('featured', !form.featured)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.featured ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                            ⭐ {form.featured ? 'Destacado' : 'No destacado'}</button>
                    </div>
                    <div className={`rounded-xl border p-4 space-y-3 transition-colors ${form.promo.active ? 'bg-rose-50 border-rose-200' : 'bg-zinc-50 border-zinc-200'}`}>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-zinc-700 flex items-center gap-1.5"><Tag size={14} /> Promoción</p>
                            <button onClick={() => setPromo('active', !form.promo.active)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${form.promo.active ? 'bg-rose-500 text-white' : 'bg-white border border-zinc-200 text-zinc-500'}`}>
                                {form.promo.active ? 'Activa' : 'Inactiva'}</button>
                        </div>
                        {form.promo.active && (
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Etiqueta</label>
                                    <input type="text" value={form.promo.label} onChange={e => setPromo('label', e.target.value)} placeholder="Ej: 20% OFF, 2x1" className="w-full px-3 py-2 border border-rose-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none bg-white" /></div>
                                <div><label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Precio Original</label>
                                    <input type="number" value={form.promo.originalPrice || ''} onChange={e => setPromo('originalPrice', e.target.value)} placeholder="Precio antes" className="w-full px-3 py-2 border border-rose-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none bg-white" /></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-6 pb-6 flex gap-3 shrink-0 border-t border-zinc-100 pt-4">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-zinc-500 text-sm font-medium hover:bg-zinc-50">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-lg bg-zinc-900 hover:bg-rose-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                        {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Check size={15} /> {isEdit ? 'Guardar' : 'Crear'}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Admin() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [editingService, setEditingService] = useState(null); // service object = edit, 'new' = create
    const [servicesOpen, setServicesOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productModal, setProductModal] = useState(null);
    const [productsOpen, setProductsOpen] = useState(false);
    const [productFilter, setProductFilter] = useState('todos');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleteServiceConfirm, setDeleteServiceConfirm] = useState(null);
    const [cancelConfirm, setCancelConfirm] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    // Settings de horario
    const [siteSettings, setSiteSettings] = useState({ openTime: '08:00', closeTime: '19:00', slotInterval: 30, workDays: [1, 2, 3, 4, 5, 6] });
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [settingsForm, setSettingsForm] = useState(null);

    useEffect(() => { fetchBookings(); fetchServices(); fetchProducts(); fetchSettings(); }, []);

    const fetchBookings = async () => {
        try { setLoading(true); const res = await apiFetch('/api/bookings'); const data = await res.json(); setBookings(Array.isArray(data) ? data : []); } catch { } finally { setLoading(false); }
    };
    const fetchServices = async () => {
        try { setLoadingServices(true); const res = await fetch(`${API}/api/services?all=true`); const data = await res.json(); setServices(Array.isArray(data) ? data : []); } catch { } finally { setLoadingServices(false); }
    };
    const fetchProducts = async () => {
        try { setLoadingProducts(true); const res = await fetch(`${API}/api/products?all=true`); const data = await res.json(); setProducts(Array.isArray(data) ? data : []); } catch { } finally { setLoadingProducts(false); }
    };
    const fetchSettings = async () => {
        try { const res = await fetch(`${API}/api/settings`); const data = await res.json(); setSiteSettings(data); setSettingsForm(data); } catch { }
    };

    const handleLogout = () => { removeToken(); navigate('/login'); };

    const handleToggleService = async (service) => {
        try { const res = await apiFetch(`/api/services/${service._id}`, { method: 'PUT', body: JSON.stringify({ active: !service.active }) }); if (res.ok) setServices(prev => prev.map(s => s._id === service._id ? { ...s, active: !s.active } : s)); } catch { }
    };
    const handleDeleteService = async (id) => {
        try { await apiFetch(`/api/services/${id}`, { method: 'DELETE' }); setServices(prev => prev.filter(s => s._id !== id)); setDeleteServiceConfirm(null); } catch { alert('Error al eliminar.'); }
    };
    const handleServiceSaved = (saved, isEdit) => {
        if (isEdit) setServices(prev => prev.map(s => s._id === saved._id ? saved : s));
        else setServices(prev => [...prev, saved]);
        setEditingService(null);
    };
    const handleToggleStock = async (product) => {
        try { const res = await apiFetch(`/api/products/${product._id}`, { method: 'PUT', body: JSON.stringify({ inStock: !product.inStock }) }); if (res.ok) setProducts(prev => prev.map(p => p._id === product._id ? { ...p, inStock: !p.inStock } : p)); } catch { }
    };
    const handleDeleteProduct = async (id) => {
        try { await apiFetch(`/api/products/${id}`, { method: 'DELETE' }); setProducts(prev => prev.filter(p => p._id !== id)); setDeleteConfirm(null); } catch { alert('Error al eliminar.'); }
    };

    const handleCancelBooking = async () => {
        if (!cancelConfirm) return;
        setCancelling(true);
        try {
            const res = await apiFetch(`/api/bookings/${cancelConfirm._id}/cancel`, { method: 'PATCH' });
            if (res.ok) { setCancelConfirm(null); fetchBookings(); }
            else { const d = await res.json(); alert(d.message || 'Error al cancelar.'); }
        } catch { alert('Error de conexión.'); }
        finally { setCancelling(false); }
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            const res = await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify(settingsForm) });
            if (res.ok) { const d = await res.json(); setSiteSettings(d); setSettingsForm(d); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2500); }
            else alert('Error al guardar configuración.');
        } catch { alert('Error de conexión.'); }
        finally { setSavingSettings(false); }
    };

    const toggleWorkDay = (day) => {
        setSettingsForm(f => ({ ...f, workDays: f.workDays.includes(day) ? f.workDays.filter(d => d !== day) : [...f.workDays, day].sort() }));
    };

    const handleProductSaved = (saved, isEdit) => {
        if (isEdit) setProducts(prev => prev.map(p => p._id === saved._id ? saved : p));
        else setProducts(prev => [saved, ...prev]);
        setProductModal(null);
    };

    // Búsqueda y filtros de turnos
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('active'); // active | cancelled | all
    const [filterDateRange, setFilterDateRange] = useState('all'); // all | today | week | month

    const PRODUCT_CATS = ['todos', 'shampoo', 'acondicionador', 'tratamiento', 'estilizado', 'perfume', 'otro'];
    const filteredProducts = productFilter === 'todos' ? products : products.filter(p => p.category === productFilter);
    const formatDate = (booking) => {
        if (!booking) return '';
        if (booking.dateStr) return new Date(booking.dateStr + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
        if (booking.date) return new Date(booking.date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
        return '';
    };

    // ── Estadísticas calculadas ───────────────────────────────────────────────
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now); endOfToday.setHours(23, 59, 59, 999);
    const startOfWeek = new Date(startOfToday); startOfWeek.setDate(startOfToday.getDate() - ((startOfToday.getDay() + 6) % 7));
    const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); endOfWeek.setHours(23, 59, 59, 999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const activeBookings = bookings.filter(b => b.status !== 'cancelled' && b.serviceName !== '🚫 HORARIO BLOQUEADO');
    const todayBookings = activeBookings.filter(b => { const d = new Date(b.startTime); return d >= startOfToday && d <= endOfToday; });
    const weekBookings = activeBookings.filter(b => { const d = new Date(b.startTime); return d >= startOfWeek && d <= endOfWeek; });
    const monthBookings = activeBookings.filter(b => { const d = new Date(b.startTime); return d >= startOfMonth && d <= endOfMonth; });
    const upcomingBookings = activeBookings.filter(b => new Date(b.startTime) >= now);
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

    // Ingresos estimados (cruzamos serviceName con services)
    const revenueWeek = weekBookings.reduce((sum, b) => { const svc = services.find(s => s.title === b.serviceName); return sum + (svc ? svc.price : 0); }, 0);
    const revenueMonth = monthBookings.reduce((sum, b) => { const svc = services.find(s => s.title === b.serviceName); return sum + (svc ? svc.price : 0); }, 0);

    // Servicios más pedidos (top 5)
    const serviceCounts = activeBookings.reduce((acc, b) => { acc[b.serviceName] = (acc[b.serviceName] || 0) + 1; return acc; }, {});
    const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxCount = topServices[0]?.[1] || 1;

    // Día de la semana con más turnos
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const bookingsByDay = Array(7).fill(0);
    activeBookings.forEach(b => { const d = new Date(b.startTime); bookingsByDay[d.getDay()]++; });
    const busiestDay = bookingsByDay.indexOf(Math.max(...bookingsByDay));

    // Hora más popular
    const bookingsByHour = {};
    activeBookings.forEach(b => { const h = b.time?.split(':')[0]; if (h) bookingsByHour[h] = (bookingsByHour[h] || 0) + 1; });
    const popularHourEntry = Object.entries(bookingsByHour).sort((a, b) => b[1] - a[1])[0];
    const popularHour = popularHourEntry ? `${popularHourEntry[0]}:00` : '—';

    // ── Filtrado de la lista de turnos ────────────────────────────────────────
    const filteredBookings = bookings.filter(b => {
        // Filtro de estado
        if (filterStatus === 'active' && b.status === 'cancelled') return false;
        if (filterStatus === 'cancelled' && b.status !== 'cancelled') return false;

        // Filtro de rango de fecha
        if (filterDateRange !== 'all') {
            const d = new Date(b.startTime);
            if (filterDateRange === 'today' && (d < startOfToday || d > endOfToday)) return false;
            if (filterDateRange === 'week' && (d < startOfWeek || d > endOfWeek)) return false;
            if (filterDateRange === 'month' && (d < startOfMonth || d > endOfMonth)) return false;
        }

        // Búsqueda por texto
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchName = b.clientName?.toLowerCase().includes(q);
            const matchPhone = b.clientPhone?.toLowerCase().includes(q);
            const matchService = b.serviceName?.toLowerCase().includes(q);
            if (!matchName && !matchPhone && !matchService) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-zinc-800">🛡️ Panel de Administración</h1>
                        <p className="text-zinc-500 text-sm mt-1">Gestioná turnos, servicios y productos.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-zinc-500 border border-zinc-100">{bookings.length} Reservas</div>
                        <button onClick={() => setShowBlockModal({ id: 999, title: "🚫 HORARIO BLOQUEADO", price: 0, duration: 60, description: "", image: "" })}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg shadow-md font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform">
                            <Lock size={16} /> Bloquear Horario
                        </button>
                        <button onClick={handleLogout} title="Cerrar sesión"
                            className="p-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:text-red-500 hover:border-red-200 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>

                {/* ── ESTADÍSTICAS ─────────────────────────────────────────── */}
                <div className="mb-8 space-y-4">

                    {/* KPIs principales */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Turnos hoy', value: todayBookings.length, icon: <CalendarCheck size={20} />, color: 'rose', sub: `${upcomingBookings.filter(b => { const d = new Date(b.startTime); return d >= startOfToday && d <= endOfToday; }).length} pendientes` },
                            { label: 'Turnos esta semana', value: weekBookings.length, icon: <Calendar size={20} />, color: 'violet', sub: `${cancelledCount} cancelados en total` },
                            { label: 'Ingresos semana', value: `$${revenueWeek.toLocaleString('es-AR')}`, icon: <DollarSign size={20} />, color: 'emerald', sub: 'estimado' },
                            { label: 'Ingresos mes', value: `$${revenueMonth.toLocaleString('es-AR')}`, icon: <TrendingUp size={20} />, color: 'amber', sub: `${monthBookings.length} turnos` },
                        ].map((kpi, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 flex flex-col gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                    ${kpi.color === 'rose' ? 'bg-rose-50 text-rose-500' :
                                        kpi.color === 'violet' ? 'bg-violet-50 text-violet-500' :
                                            kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
                                                'bg-amber-50 text-amber-500'}`}>
                                    {kpi.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-zinc-800 leading-none mb-1">{kpi.value}</p>
                                    <p className="text-xs font-semibold text-zinc-500">{kpi.label}</p>
                                    <p className="text-[11px] text-zinc-300 mt-0.5">{kpi.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Segunda fila: Top servicios + insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Top servicios */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                            <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2">
                                <BarChart2 size={18} className="text-rose-500" /> Servicios más pedidos
                            </h3>
                            {topServices.length === 0 ? (
                                <p className="text-zinc-300 text-sm text-center py-6">Sin datos todavía</p>
                            ) : (
                                <div className="space-y-3">
                                    {topServices.map(([name, count], i) => (
                                        <div key={name} className="flex items-center gap-3">
                                            <span className={`text-xs font-black w-5 text-right shrink-0 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-zinc-400' : i === 2 ? 'text-amber-800/60' : 'text-zinc-300'}`}>
                                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-semibold text-zinc-700 truncate">{name}</span>
                                                    <span className="text-xs font-bold text-zinc-500 ml-2 shrink-0">{count} {count === 1 ? 'turno' : 'turnos'}</span>
                                                </div>
                                                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-rose-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${(count / maxCount) * 100}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Insights */}
                        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-4">
                            <h3 className="font-bold text-zinc-800 flex items-center gap-2">
                                <Star size={18} className="text-rose-500" /> Insights
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between py-2.5 border-b border-zinc-50">
                                    <span className="text-zinc-500 flex items-center gap-2"><Clock size={14} /> Hora pico</span>
                                    <span className="font-bold text-zinc-800">{popularHour}</span>
                                </div>
                                <div className="flex items-center justify-between py-2.5 border-b border-zinc-50">
                                    <span className="text-zinc-500 flex items-center gap-2"><Calendar size={14} /> Día más ocupado</span>
                                    <span className="font-bold text-zinc-800">{activeBookings.length ? dayNames[busiestDay] : '—'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2.5 border-b border-zinc-50">
                                    <span className="text-zinc-500 flex items-center gap-2"><ArrowUpRight size={14} /> Próximos turnos</span>
                                    <span className="font-bold text-zinc-800">{upcomingBookings.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-zinc-500 flex items-center gap-2"><XCircle size={14} /> Cancelados totales</span>
                                    <span className={`font-bold ${cancelledCount > 0 ? 'text-red-400' : 'text-zinc-800'}`}>{cancelledCount}</span>
                                </div>
                            </div>
                            {activeBookings.length > 0 && (
                                <div className="mt-auto pt-3 border-t border-zinc-50">
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                                        Basado en <strong>{activeBookings.length}</strong> turnos activos en total.
                                        Los ingresos son estimados según el precio actual de cada servicio.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SERVICIOS */}
                <div className="mb-6 bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <button onClick={() => setServicesOpen(!servicesOpen)} className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors">
                        <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                            <Settings size={20} className="text-rose-500" /> Gestión de Servicios
                            <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full ml-1">{services.filter(s => s.active).length} activos</span>
                        </h2>
                        {servicesOpen ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
                    </button>
                    {servicesOpen && (
                        <div className="border-t border-zinc-100">
                            <div className="flex justify-end px-6 py-3 bg-zinc-50 border-b border-zinc-100">
                                <button onClick={e => { e.stopPropagation(); setEditingService('new'); }} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                                    <Plus size={14} /> Nuevo Servicio
                                </button>
                            </div>
                            {loadingServices ? <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-7 w-7 border-b-2 border-rose-400" /></div> : (
                                <div className="divide-y divide-zinc-50">
                                    {services.map(service => (
                                        <div key={service._id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${!service.active ? 'opacity-50 bg-zinc-50' : 'hover:bg-rose-50/30'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${service.active ? 'bg-rose-50 text-rose-400' : 'bg-zinc-100 text-zinc-300'}`}><Scissors size={18} /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-semibold text-sm truncate ${service.active ? 'text-zinc-800' : 'text-zinc-400'}`}>{service.title}</p>
                                                <p className="text-xs text-zinc-400 truncate">{service.description}</p>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-3 shrink-0">
                                                <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"><DollarSign size={13} /> {service.price}</div>
                                                <div className="flex items-center gap-1 text-sm font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-lg"><Timer size={13} /> {service.duration} min</div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button onClick={() => setEditingService(service)} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"><Pencil size={15} /></button>
                                                <button onClick={() => handleToggleService(service)} className={`p-2 rounded-lg transition-colors ${service.active ? 'text-rose-400 hover:bg-rose-50' : 'text-zinc-300 hover:bg-zinc-100'}`}>
                                                    {service.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                </button>
                                                <button onClick={() => setDeleteServiceConfirm(service)} className="p-2 rounded-lg hover:bg-red-50 text-zinc-300 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* PRODUCTOS */}
                <div className="mb-8 bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <button onClick={() => setProductsOpen(!productsOpen)} className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors">
                        <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-rose-500" /> Gestión de Productos
                            <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full ml-1">{products.length} productos</span>
                            {products.filter(p => !p.inStock).length > 0 && (
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{products.filter(p => !p.inStock).length} sin stock</span>
                            )}
                        </h2>
                        {productsOpen ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
                    </button>
                    {productsOpen && (
                        <div className="border-t border-zinc-100">
                            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-zinc-50 border-b border-zinc-100">
                                <div className="flex gap-2 flex-wrap">
                                    {PRODUCT_CATS.map(cat => (
                                        <button key={cat} onClick={() => setProductFilter(cat)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all capitalize ${productFilter === cat ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}>{cat}</button>
                                    ))}
                                </div>
                                <button onClick={() => setProductModal('new')} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                                    <Plus size={14} /> Nuevo Producto
                                </button>
                            </div>
                            {loadingProducts ? <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-7 w-7 border-b-2 border-rose-400" /></div> :
                                filteredProducts.length === 0 ? <div className="text-center py-12 text-zinc-400 text-sm">No hay productos en esta categoría.</div> : (
                                    <div className="divide-y divide-zinc-50">
                                        {filteredProducts.map(product => (
                                            <div key={product._id} className={`flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-zinc-50 ${!product.inStock ? 'opacity-60' : ''}`}>
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                                                    {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300"><ShoppingBag size={16} /></div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-semibold text-sm text-zinc-800 truncate">{product.name}</p>
                                                        {product.brand && <span className="text-[10px] text-zinc-400 font-medium">{product.brand}</span>}
                                                        {product.promo?.active && <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Tag size={8} /> {product.promo.label}</span>}
                                                        {!product.inStock && <span className="text-[10px] font-bold bg-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded-full">Sin stock</span>}
                                                    </div>
                                                    <p className="text-xs text-zinc-400 capitalize">{product.category}</p>
                                                </div>
                                                <div className="hidden sm:block shrink-0">
                                                    <p className="text-sm font-black text-zinc-800">${product.price.toLocaleString('es-AR')}</p>
                                                    {product.promo?.active && product.promo.originalPrice && <p className="text-[10px] text-zinc-400 line-through text-right">${Number(product.promo.originalPrice).toLocaleString('es-AR')}</p>}
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button onClick={() => handleToggleStock(product)} title={product.inStock ? 'Sin stock' : 'En stock'} className={`p-2 rounded-lg transition-colors ${product.inStock ? 'text-emerald-500 hover:bg-emerald-50' : 'text-zinc-400 hover:bg-zinc-100'}`}>
                                                        {product.inStock ? <Package size={15} /> : <PackageX size={15} />}
                                                    </button>
                                                    <button onClick={() => setProductModal(product)} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"><Pencil size={15} /></button>
                                                    <button onClick={() => setDeleteConfirm(product)} className="p-2 rounded-lg hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    )}
                </div>

                {/* HORARIOS DE ATENCIÓN */}
                <div className="mb-6 bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <button onClick={() => setSettingsOpen(!settingsOpen)} className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors">
                        <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                            <SlidersHorizontal size={20} className="text-rose-500" /> Horarios de Atención
                        </h2>
                        {settingsOpen ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
                    </button>
                    {settingsOpen && settingsForm && (
                        <div className="px-6 pb-6 space-y-6 border-t border-zinc-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                {/* Hora apertura */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Apertura</label>
                                    <input type="time" value={settingsForm.openTime}
                                        onChange={e => setSettingsForm(f => ({ ...f, openTime: e.target.value }))}
                                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 outline-none" />
                                </div>
                                {/* Hora cierre */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Cierre</label>
                                    <input type="time" value={settingsForm.closeTime}
                                        onChange={e => setSettingsForm(f => ({ ...f, closeTime: e.target.value }))}
                                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 outline-none" />
                                </div>
                                {/* Intervalo de slots */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Intervalo entre turnos</label>
                                    <select value={settingsForm.slotInterval}
                                        onChange={e => setSettingsForm(f => ({ ...f, slotInterval: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 outline-none bg-white">
                                        {[15, 20, 30, 45, 60].map(m => <option key={m} value={m}>{m} minutos</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Días de trabajo */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Teléfono / WhatsApp del salón</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-zinc-400 mb-1">Número visible (ej: +54 9 2337 403819)</label>
                                        <input type="text" value={settingsForm.salonPhone || ''}
                                            onChange={e => setSettingsForm(f => ({ ...f, salonPhone: e.target.value }))}
                                            placeholder="+54 9 2337 403819"
                                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-zinc-400 mb-1">Número para WhatsApp (sin + ni espacios)</label>
                                        <input type="text" value={settingsForm.salonWhatsapp || ''}
                                            onChange={e => setSettingsForm(f => ({ ...f, salonWhatsapp: e.target.value }))}
                                            placeholder="5492337403819"
                                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Días de trabajo */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Días que atiende</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((name, i) => {
                                        const active = settingsForm.workDays.includes(i);
                                        return (
                                            <button key={i} onClick={() => toggleWorkDay(i)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${active ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'
                                                    }`}>
                                                {name}
                                            </button>
                                        );
                                    })}
                                </div>
                                {settingsForm.workDays.length === 0 && (
                                    <p className="text-xs text-amber-500 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Seleccioná al menos un día.</p>
                                )}
                            </div>

                            {/* Guardar */}
                            <div className="flex items-center gap-3">
                                <button onClick={handleSaveSettings}
                                    disabled={savingSettings || settingsForm.workDays.length === 0}
                                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 transition-colors">
                                    {savingSettings
                                        ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Guardando...</>
                                        : <><Check size={15} /> Guardar cambios</>
                                    }
                                </button>
                                {settingsSaved && (
                                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                        <Check size={14} /> ¡Guardado!
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* CALENDARIO */}
                <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                    <h2 className="text-xl font-bold text-zinc-800 mb-4 flex items-center gap-2"><Calendar size={20} className="text-rose-500" /> Vista Semanal</h2>
                    <WeeklyCalendar bookings={bookings} onBookingCancelled={fetchBookings} />
                </div>

                {/* ── TURNOS: buscador + filtros + lista ───────────────────── */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 px-1">
                        <h2 className="text-xl font-bold text-zinc-800">Turnos</h2>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                            {filteredBookings.length} resultado{filteredBookings.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Buscador + filtros */}
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
                        {/* Buscador */}
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, teléfono o servicio..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Filtro estado */}
                        <div className="flex gap-1.5 items-center">
                            {[['active', 'Activos'], ['cancelled', 'Cancelados'], ['all', 'Todos']].map(([val, label]) => (
                                <button key={val} onClick={() => setFilterStatus(val)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${filterStatus === val
                                            ? 'bg-zinc-800 text-white border-zinc-800'
                                            : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                                        }`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Filtro fecha */}
                        <div className="flex gap-1.5 items-center">
                            {[['all', 'Todo'], ['today', 'Hoy'], ['week', 'Semana'], ['month', 'Mes']].map(([val, label]) => (
                                <button key={val} onClick={() => setFilterDateRange(val)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${filterDateRange === val
                                            ? 'bg-rose-500 text-white border-rose-500'
                                            : 'bg-white text-zinc-500 border-zinc-200 hover:border-rose-300'
                                        }`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lista */}
                    {loading ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" /></div>
                    ) : (
                        <div className="grid gap-3">
                            {filteredBookings.length > 0 ? filteredBookings.map((booking) => {
                                const isBlocked = booking.serviceName === '🚫 HORARIO BLOQUEADO';
                                const isCancelled = booking.status === 'cancelled';
                                return (
                                    <div key={booking._id} className={`p-5 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-shadow relative overflow-hidden
                                        ${isCancelled ? 'bg-zinc-50 border-zinc-200 opacity-60'
                                            : isBlocked ? 'bg-zinc-100 border-zinc-200'
                                                : 'bg-white border-zinc-100 hover:shadow-md'}`}>

                                        <div className={`absolute left-0 top-0 bottom-0 w-1
                                            ${isCancelled ? 'bg-zinc-300' : isBlocked ? 'bg-zinc-400' : 'bg-rose-500'}`} />

                                        <div className="flex items-start gap-4 pl-2">
                                            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0
                                                ${isCancelled ? 'bg-zinc-200 text-zinc-400' : isBlocked ? 'bg-zinc-200 text-zinc-500' : 'bg-rose-50 text-rose-500'}`}>
                                                {isBlocked ? <Lock size={18} /> : <Scissors size={18} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={`font-bold ${isCancelled ? 'text-zinc-400 line-through' : isBlocked ? 'text-zinc-600' : 'text-zinc-800'}`}>
                                                        {booking.serviceName}
                                                    </h3>
                                                    {isCancelled && <span className="text-[10px] font-bold bg-zinc-200 text-zinc-500 px-2 py-0.5 rounded-full">CANCELADO</span>}
                                                </div>
                                                {!isBlocked && (
                                                    <p className="text-zinc-500 text-sm flex items-center gap-2 mt-0.5">
                                                        <User size={13} /> {booking.clientName}
                                                        <span className="text-zinc-200">|</span>
                                                        <Phone size={13} /> {booking.clientPhone}
                                                    </p>
                                                )}
                                                {isBlocked && (
                                                    <p className="text-zinc-400 text-xs italic mt-0.5">
                                                        {booking.clientName !== 'Administración' ? booking.clientName : 'Espacio reservado'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-2 text-sm pl-2">
                                            <div className="flex items-center gap-2 font-medium text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100 text-xs">
                                                <Calendar size={12} className="text-zinc-400" /> {formatDate(booking)}
                                            </div>
                                            <div className={`flex items-center gap-2 font-bold px-3 py-1.5 rounded-lg w-fit border text-xs
                                                ${isCancelled ? 'text-zinc-400 bg-zinc-100 border-zinc-200'
                                                    : isBlocked ? 'text-zinc-500 bg-zinc-100 border-zinc-200'
                                                        : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                                                <Clock size={12} /> {booking.time}
                                                {booking.endTime && <span className="text-zinc-400 font-normal">→ {new Date(booking.endTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>}
                                            </div>
                                            {!isCancelled && (
                                                <div className="flex items-center gap-1">
                                                    {!isBlocked && booking.clientPhone && (
                                                        <a href={clientWhatsAppUrl(booking)} target="_blank" rel="noreferrer"
                                                            className="flex items-center gap-1 text-[11px] text-green-600 hover:text-green-700 font-medium px-2 py-1 rounded-lg hover:bg-green-50 transition-colors">
                                                            <Phone size={11} /> Confirmar por WhatsApp
                                                        </a>
                                                    )}
                                                    <button onClick={() => setCancelConfirm(booking)}
                                                        className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                                                        <X size={11} /> {isBlocked ? 'Liberar' : 'Cancelar'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-zinc-200">
                                    <Search size={40} className="mx-auto text-zinc-200 mb-3" />
                                    <p className="text-zinc-400 font-medium">
                                        {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No hay turnos con estos filtros.'}
                                    </p>
                                    <button onClick={() => { setSearchQuery(''); setFilterStatus('active'); setFilterDateRange('all'); }}
                                        className="mt-3 text-xs text-rose-500 hover:underline font-medium">
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showBlockModal && <BookingModal service={showBlockModal} onClose={() => { setShowBlockModal(null); fetchBookings(); }} />}
            {editingService && <ServiceModal service={editingService === 'new' ? null : editingService} onClose={() => setEditingService(null)} onSave={handleServiceSaved} />}
            {productModal && <ProductModal product={productModal === 'new' ? null : productModal} onClose={() => setProductModal(null)} onSave={handleProductSaved} />}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
                        <h3 className="font-bold text-zinc-800 text-lg mb-1">¿Eliminar producto?</h3>
                        <p className="text-zinc-500 text-sm mb-6">"{deleteConfirm.name}" se eliminará permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-medium text-sm hover:bg-zinc-50">Cancelar</button>
                            <button onClick={() => handleDeleteProduct(deleteConfirm._id)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {cancelConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={24} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-zinc-800 text-lg mb-1">
                            {cancelConfirm.serviceName === "🚫 HORARIO BLOQUEADO" ? "¿Liberar este horario?" : "¿Cancelar este turno?"}
                        </h3>
                        <p className="text-zinc-500 text-sm mb-1">
                            {cancelConfirm.serviceName === "🚫 HORARIO BLOQUEADO"
                                ? "El horario quedará disponible para nuevas reservas."
                                : `Turno de ${cancelConfirm.clientName} — ${cancelConfirm.serviceName}`}
                        </p>
                        <p className="text-zinc-400 text-xs mb-6">{formatDate(cancelConfirm)} · {cancelConfirm.time}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setCancelConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-medium text-sm hover:bg-zinc-50">Volver</button>
                            <button onClick={handleCancelBooking} disabled={cancelling}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                {cancelling ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><X size={14} /> Confirmar</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteServiceConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
                        <h3 className="font-bold text-zinc-800 text-lg mb-1">¿Eliminar servicio?</h3>
                        <p className="text-zinc-500 text-sm mb-6">"{deleteServiceConfirm.title}" se eliminará permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteServiceConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-medium text-sm hover:bg-zinc-50">Cancelar</button>
                            <button onClick={() => handleDeleteService(deleteServiceConfirm._id)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}