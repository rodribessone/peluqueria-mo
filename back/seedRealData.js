// ──────────────────────────────────────────────────────────────────────────────
// SEED de datos reales — Peluquería M&O
// Ejecutar UNA VEZ desde la carpeta back/ con:  node seedRealData.js
// ⚠️ BORRA los servicios y productos existentes y carga los reales.
// ──────────────────────────────────────────────────────────────────────────────
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';
import Product from './models/Product.js';

dotenv.config();

// ── SERVICIOS REALES ──────────────────────────────────────────────────────────
const SERVICES = [
    {
        title: 'Corte',
        description: 'Corte de pelo personalizado con asesoramiento de imagen. Incluye lavado y peinado final.',
        price: 20000,
        priceFrom: false,
        duration: 60,
        category: 'corte',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
        active: true, order: 1,
    },
    {
        title: 'Tintura y Corte',
        description: 'Color completo con tinturas de calidad más corte personalizado. El combo más elegido.',
        price: 60000,
        priceFrom: false,
        duration: 180,
        category: 'color',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
        active: true, order: 2,
    },
    {
        title: 'Tintura',
        description: 'Coloración completa con tinturas de primera calidad. Incluye nutrición post-color.',
        price: 40000,
        priceFrom: false,
        duration: 120,
        category: 'color',
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800',
        active: true, order: 3,
    },
    {
        title: 'Reflejos',
        description: 'Mechas y reflejos a mano alzada para un look natural y luminoso. El precio final depende del largo y volumen del pelo.',
        price: 60000,
        priceFrom: true,
        duration: 180,
        category: 'color',
        image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800',
        active: true, order: 4,
    },
    {
        title: 'Alisados',
        description: 'Alisado progresivo antifrizz que deja el pelo sedoso por meses. El precio final depende del largo y volumen del pelo.',
        price: 60000,
        priceFrom: true,
        duration: 150,
        category: 'tratamiento',
        image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800',
        active: true, order: 5,
    },
];

// ── PRODUCTOS REALES ──────────────────────────────────────────────────────────
// Imágenes genéricas por tipo (después se reemplazan desde el Admin con fotos reales)
const IMG_CREMA = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800';
const IMG_CREMA_2 = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800';
const IMG_MASCARA = 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800';
const IMG_OLEO = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800';
const IMG_PERFUME = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800';
const IMG_PERFUME2 = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800';
const IMG_PERFUME3 = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800';
const IMG_KIT = 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=800';

const SKALA_GUSTOS = 'Gustos disponibles: Abacate, Divino Potinho, Mais Cachos, Babosa, Manteca de Karité, Amidinho de Milho, Doña, Açaí, Coco, Morango, Manga, Cereja, Melancia y Vinagre de Maçã.';

const PRODUCTS = [
    // ── Cremas ────────────────────────────────────────────────────────────────
    {
        name: 'Crema Skala x 1kg',
        brand: 'Skala',
        description: `Máscara vegana de tratamiento capilar. ${SKALA_GUSTOS} Consultanos por el gusto que buscás.`,
        price: 8000,
        category: 'tratamiento',
        image: IMG_CREMA,
        inStock: true, featured: true,
    },
    {
        name: 'Crema de Peinar Skala x 250g',
        brand: 'Skala',
        description: `Crema de peinar vegana, mismos gustos que la línea de 1kg. ${SKALA_GUSTOS}`,
        price: 5500,
        category: 'estilizado',
        image: IMG_CREMA_2,
        inStock: true, featured: false,
    },
    {
        name: 'Máscara Karseell Collagen x 500g',
        brand: 'Karseell',
        description: 'Máscara de colágeno reparación profunda. Ideal para pelo dañado, seco o procesado. El tratamiento viral que revive el pelo.',
        price: 25000,
        category: 'tratamiento',
        image: IMG_MASCARA,
        inStock: true, featured: true,
    },
    {
        name: 'Óleo Karseell',
        brand: 'Karseell',
        description: 'Aceite capilar de colágeno para puntas secas y frizz. Sella, nutre y da brillo sin apelmazar.',
        price: 18000,
        category: 'tratamiento',
        image: IMG_OLEO,
        inStock: true, featured: false,
    },

    // ── Perfumes árabes ───────────────────────────────────────────────────────
    ...[
        'Ansaan Silver', 'King of Arabia', 'Atlas', 'Maitre de Blue', 'Ajwaa',
        'Spectre Ghost', 'Honor & Glory', 'Qaed Al Fursan', 'Rose Origami',
        'Mayar Cherry Intense', 'Club de Nuit Untold', 'Club de Nuit Imperiale',
        'Philos Pura Maison Alhambra', 'Rave Nora', 'Luxe Gold', 'Anghan',
        'Yara Moi', 'Mía Dolcezza Verde', 'Sakeena', 'Ajayeb Dubai',
        'Leone Intense', 'Sceptre Desert', 'Stella Dustin Our Love Fuchsia',
        'His Confession', 'Sceptre Malachite', 'Hayaati', 'Khamrah Dukhan',
        'Al Qiam Gold', 'Ishq Al Shuyukh Silver', 'Ishq Al Shuyukh Gold',
        'Azzure Aoud', 'Cocoa Morado', 'Nitro Red', 'Nitro Black',
        'Asad Zanzíbar', 'Afnan 9PM',
    ].map((name, i) => ({
        name,
        brand: 'Perfume Árabe',
        description: 'Perfume árabe importado de alta duración y proyección. Fragancia intensa que dura todo el día.',
        price: 70000,
        category: 'perfume',
        image: [IMG_PERFUME, IMG_PERFUME2, IMG_PERFUME3][i % 3],
        inStock: true,
        featured: ['Khamrah Dukhan', 'Asad Zanzíbar', 'Afnan 9PM', 'Club de Nuit Untold'].includes(name),
    })),

    // ── Sets / Kits ───────────────────────────────────────────────────────────
    {
        name: 'Amber Oud Gold Set',
        brand: 'Perfume Árabe',
        description: 'Set de regalo Amber Oud Gold. Ideal para regalar o regalarte.',
        price: 120000,
        category: 'perfume',
        image: IMG_KIT,
        inStock: true, featured: false,
    },
    {
        name: 'Kit Club de Nuit Parfum',
        brand: 'Armaf',
        description: 'Kit completo Club de Nuit. La fragancia icónica en formato set.',
        price: 120000,
        category: 'perfume',
        image: IMG_KIT,
        inStock: true, featured: false,
    },
    {
        name: 'Kit Lattafa of Universe',
        brand: 'Lattafa',
        description: 'Kit de fragancias Lattafa. Varias fragancias para combinar según la ocasión.',
        price: 120000,
        category: 'perfume',
        image: IMG_KIT,
        inStock: true, featured: false,
    },
    {
        name: 'Kit Odisey Spectra',
        brand: 'Armaf',
        description: 'Kit Odyssey Spectra. Set de fragancias de la línea Odyssey.',
        price: 120000,
        category: 'perfume',
        image: IMG_KIT,
        inStock: true, featured: false,
    },

    // ── Perfumes nacionales ───────────────────────────────────────────────────
    {
        name: 'Paula',
        brand: 'Paula Cahen D\'Anvers',
        description: 'El clásico de siempre. Fragancia fresca y femenina.',
        price: 18000,
        category: 'perfume',
        image: IMG_PERFUME2,
        inStock: true, featured: false,
    },
    {
        name: 'Paula Aura',
        brand: 'Paula Cahen D\'Anvers',
        description: 'Versión Aura del clásico Paula. Más dulce y envolvente.',
        price: 18000,
        category: 'perfume',
        image: IMG_PERFUME,
        inStock: true, featured: false,
    },
    {
        name: 'Caro Cuore (Rojo)',
        brand: 'Caro Cuore',
        description: 'Caro Cuore edición roja. Fragancia clásica argentina.',
        price: 22000,
        category: 'perfume',
        image: IMG_PERFUME3,
        inStock: true, featured: false,
    },
    {
        name: 'Caro Cuore (Blanco y Rojo)',
        brand: 'Caro Cuore',
        description: 'Caro Cuore edición blanco y rojo.',
        price: 22000,
        category: 'perfume',
        image: IMG_PERFUME,
        inStock: true, featured: false,
    },
    {
        name: 'Ana Pink by Amalia Maiorana',
        brand: 'Amalia Maiorana',
        description: 'Fragancia femenina dulce y juvenil.',
        price: 20000,
        category: 'perfume',
        image: IMG_PERFUME2,
        inStock: true, featured: false,
    },
    {
        name: 'Valeria Velvet',
        brand: 'Valeria',
        description: 'Fragancia aterciopelada y elegante.',
        price: 15000,
        category: 'perfume',
        image: IMG_PERFUME3,
        inStock: true, featured: false,
    },
];

// ── Ejecución ─────────────────────────────────────────────────────────────────
async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Conectado a MongoDB');

        // Borrar datos existentes
        await Service.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Servicios y productos anteriores eliminados');

        // Insertar servicios
        const services = await Service.insertMany(SERVICES);
        console.log(`✅ ${services.length} servicios creados`);

        // Insertar productos
        const products = await Product.insertMany(PRODUCTS);
        console.log(`✅ ${products.length} productos creados`);

        console.log('\n🎉 Seed completado. Resumen:');
        console.log(`   - ${services.length} servicios (Corte, Tintura y Corte, Tintura, Reflejos*, Alisados*)`);
        console.log(`   - 4 cremas/tratamientos`);
        console.log(`   - ${products.length - 4} perfumes`);
        console.log('   * = precio "desde"');
        console.log('\n💡 Las fotos son genéricas — reemplazalas desde el panel Admin con fotos reales de cada producto.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error en seed:', err);
        process.exit(1);
    }
}

seed();