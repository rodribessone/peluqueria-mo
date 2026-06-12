import express from 'express';
import Product from '../models/Product.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Listar productos (con filtro opcional por categoría)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        // El admin puede pedir todos, el front solo los que tienen stock
        if (req.query.all !== 'true') filter.inStock = true;

        const products = await Product.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Crear producto — solo admin
router.post('/', auth, async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Editar producto — solo admin
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Eliminar producto — solo admin
router.delete('/:id', auth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Seed inicial — solo admin
router.post('/seed/init', auth, async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) return res.json({ message: 'Ya existen productos, seed omitido.' });

        const defaultProducts = [
            {
                name: 'Shampoo Nutritivo Cabello Seco',
                brand: 'Loreal',
                description: 'Fórmula enriquecida con aceite de argán para cabello seco y sin brillo.',
                price: 2800,
                category: 'shampoo',
                image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=600',
                inStock: true, featured: true, order: 1
            },
            {
                name: 'Shampoo Anti-Frizz Control',
                brand: 'Schwarzkopf',
                description: 'Controla el frizz y aporta suavidad duradera.',
                price: 3200,
                category: 'shampoo',
                image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca55?auto=format&fit=crop&q=80&w=600',
                inStock: true, order: 2
            },
            {
                name: 'Acondicionador Hidratación Profunda',
                brand: 'Loreal',
                description: 'Hidrata y desenreda en un solo paso. Apto para todo tipo de cabello.',
                price: 2600,
                category: 'acondicionador',
                image: 'https://images.unsplash.com/photo-1571781565036-d3f759be73e4?auto=format&fit=crop&q=80&w=600',
                inStock: true, order: 3
            },
            {
                name: 'Mascarilla Keratina Reconstrucción',
                brand: 'Wella',
                description: 'Tratamiento intensivo que repara el daño desde adentro. Uso semanal.',
                price: 4500,
                category: 'tratamiento',
                image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600',
                inStock: true, featured: true, order: 4,
                promo: { active: true, label: '15% OFF', originalPrice: 5300 }
            },
            {
                name: 'Aceite de Argán Brillo Intenso',
                brand: 'Moroccanoil',
                description: 'Sérum de acabado que aporta brillo y suavidad sin efecto graso.',
                price: 5800,
                category: 'tratamiento',
                image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600',
                inStock: true, order: 5
            },
            {
                name: 'Cera Modeladora Fijación Fuerte',
                brand: 'Redken',
                description: 'Define y moldea sin resecar. Ideal para looks estructurados.',
                price: 2200,
                category: 'estilizado',
                image: 'https://images.unsplash.com/photo-1597586124394-fbd6ef244026?auto=format&fit=crop&q=80&w=600',
                inStock: true, order: 6
            },
            {
                name: 'Spray Fijador Larga Duración',
                brand: 'Tresemmé',
                description: 'Fija el peinado hasta 48hs sin apelmazar.',
                price: 1800,
                category: 'estilizado',
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
                inStock: false, order: 7
            },
            {
                name: 'Perfume Floral & Madera',
                brand: 'Carolina Herrera',
                description: 'Fragancia femenina con notas de rosa, jazmín y sándalo. 100ml.',
                price: 18500,
                category: 'perfume',
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=600',
                inStock: true, featured: true, order: 8
            },
            {
                name: 'Perfume Amaderado Intenso',
                brand: 'Dior',
                description: 'Fragancia masculina con notas de cedro, ámbar y cuero. 100ml.',
                price: 22000,
                category: 'perfume',
                image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
                inStock: true, order: 9,
                promo: { active: true, label: '2x1', originalPrice: 22000 }
            },
            {
                name: 'Perfume Fresh Citrus',
                brand: 'Acqua di Gio',
                description: 'Frescura marina con notas de bergamota y almizcle. 100ml.',
                price: 19800,
                category: 'perfume',
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=600',
                inStock: true, order: 10
            }
        ];

        await Product.insertMany(defaultProducts);
        res.status(201).json({ message: `${defaultProducts.length} productos creados.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;