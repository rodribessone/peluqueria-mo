import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    priceFrom: {
        type: Boolean,
        default: false // true = el precio es "desde $X en adelante"
    },
    duration: {
        type: Number, // En minutos
        required: true
    },
    category: {
        type: String,
        enum: ['corte', 'color', 'tratamiento', 'peinado', 'masculino', 'otro'],
        default: 'otro'
    },
    image: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;