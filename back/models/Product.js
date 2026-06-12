import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ['shampoo', 'acondicionador', 'tratamiento', 'estilizado', 'perfume', 'otro'],
        required: true
    },
    image: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    promo: {
        active: { type: Boolean, default: false },
        label: { type: String, default: '' },       // ej: "2x1", "20% OFF"
        originalPrice: { type: Number, default: null }
    },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;