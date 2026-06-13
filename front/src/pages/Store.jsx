import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Sparkles, Droplets, Wind, FlaskConical, Star, Tag, PackageX, ChevronRight } from 'lucide-react';

const CATEGORIES = [
    { id: 'todos', label: 'Todo', icon: ShoppingBag },
    { id: 'shampoo', label: 'Shampoos', icon: Droplets },
    { id: 'acondicionador', label: 'Acondicionadores', icon: Droplets },
    { id: 'tratamiento', label: 'Tratamientos', icon: FlaskConical },
    { id: 'estilizado', label: 'Estilizado', icon: Wind },
    { id: 'perfume', label: 'Perfumes', icon: Sparkles },
];

function ProductCard({ product }) {
    const hasPromo = product.promo?.active;
    const outOfStock = !product.inStock;
    const WA_NUMBER = '5492337403819';

    const handleConsultar = () => {
        const msg = `Hola! Quería consultar por el producto *${product.name}*${product.brand ? ` de ${product.brand}` : ''} que vi en la página. ¿Está disponible?`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col
            ${outOfStock
                ? 'border-zinc-100 opacity-60 grayscale'
                : 'border-zinc-100 hover:shadow-xl hover:-translate-y-1 shadow-sm'
            }`}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {hasPromo && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                        <Tag size={9} /> {product.promo.label}
                    </span>
                )}
                {product.featured && !hasPromo && (
                    <span className="bg-amber-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                        <Star size={9} /> Destacado
                    </span>
                )}
                {outOfStock && (
                    <span className="bg-zinc-700 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <PackageX size={9} /> Sin stock
                    </span>
                )}
            </div>

            {/* Imagen */}
            <div className="h-52 overflow-hidden bg-zinc-50 relative">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200">
                        <ShoppingBag size={48} />
                    </div>
                )}
                {/* Overlay sutil en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Contenido */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Marca */}
                {product.brand && (
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{product.brand}</p>
                )}

                <h3 className="font-bold text-zinc-800 text-base leading-snug mb-2 group-hover:text-rose-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-zinc-500 text-xs leading-relaxed flex-grow mb-4">
                    {product.description}
                </p>

                {/* Precio */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50">
                    <div>
                        <p className="text-xl font-black text-zinc-800">
                            ${product.price.toLocaleString('es-AR')}
                        </p>
                        {hasPromo && product.promo.originalPrice && (
                            <p className="text-xs text-zinc-400 line-through">
                                ${product.promo.originalPrice.toLocaleString('es-AR')}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={!outOfStock ? handleConsultar : undefined}
                        disabled={outOfStock}
                        className={`text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-1.5
                            ${outOfStock
                                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                                : 'bg-zinc-900 hover:bg-rose-600 text-white shadow-md hover:shadow-lg active:scale-95'
                            }`}
                    >
                        {outOfStock ? 'Sin stock' : <><ShoppingBag size={13} /> Consultar</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Store() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('todos');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/products`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error cargando productos:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = activeCategory === 'todos'
        ? products
        : products.filter(p => p.category === activeCategory);

    const promos = products.filter(p => p.promo?.active && p.inStock);

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            <Navbar />

            {/* Hero */}
            <div className="relative bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, #f43f5e 0%, transparent 50%),
                                          radial-gradient(circle at 80% 20%, #fb923c 0%, transparent 40%)`
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <p className="text-rose-400 text-xs font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                            <Sparkles size={12} /> Peluquería M&O
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-tight mb-4">
                            Tienda de<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
                                Productos
                            </span>
                        </h1>
                        <p className="text-zinc-400 text-base max-w-md">
                            Shampoos, tratamientos, ceras y perfumes de las mejores marcas. Los mismos productos que usamos en el salón.
                        </p>
                    </div>

                    {/* Stats rápidas */}
                    <div className="flex gap-4 shrink-0">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
                            <p className="text-3xl font-black text-white">{products.length}</p>
                            <p className="text-zinc-500 text-xs mt-1">Productos</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
                            <p className="text-3xl font-black text-rose-400">{promos.length}</p>
                            <p className="text-zinc-500 text-xs mt-1">Promociones</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Franja de promos (si hay) */}
            {promos.length > 0 && (
                <div className="bg-rose-500 text-white py-2.5 overflow-hidden">
                    <div className="flex gap-8 animate-marquee whitespace-nowrap px-6">
                        {[...promos, ...promos].map((p, i) => (
                            <span key={i} className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0">
                                <Tag size={11} /> {p.promo.label} en {p.name}
                                <span className="text-rose-300 mx-2">·</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Categorías */}
                <div className="flex gap-2 flex-wrap mb-10">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const count = cat.id === 'todos'
                            ? products.length
                            : products.filter(p => p.category === cat.id).length;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all
                                    ${activeCategory === cat.id
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800'
                                    }`}
                            >
                                <Icon size={15} />
                                {cat.label}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-400" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-zinc-200">
                        <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-4" />
                        <p className="text-zinc-400 font-medium">No hay productos en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                    display: inline-flex;
                }
            `}</style>

            <Footer />
        </div>
    );
}