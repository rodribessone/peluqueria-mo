import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientPhone: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        default: ''
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceDuration: {
        type: Number, // En minutos
        required: true
    },
    // "YYYY-MM-DD" en hora argentina — campo string para filtrar sin ambigüedad de timezone
    dateStr: {
        type: String,
        index: true
    },
    date: {
        type: Date,
        required: false
    },
    time: {
        type: String, // "HH:MM" en hora argentina — fuente de verdad para solapamiento de slots
        required: true
    },
    startTime: {
        type: Date, // UTC — para validar solapamiento en el backend
        required: true
    },
    endTime: {
        type: Date, // UTC — para validar solapamiento en el backend
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'blocked'],
        default: 'confirmed'
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// dateStr ya tiene index: true en la definición del campo
bookingSchema.index({ startTime: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;