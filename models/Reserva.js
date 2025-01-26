import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    numeroTelefonico: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cantClientes: {
        type: Number,
        required: true
    },
    fechaReserva: {
        type: Date,
        required: true
    },
    horaReserva: {
        type: String,
        required: true
    },
    estado:{
        type:String,
        require:true
    }
}, {
    timestamps: true,  
});

// Agregar el plugin de paginación
import mongoosePaginate from 'mongoose-paginate-v2';
reservaSchema.plugin(mongoosePaginate);

const SchemeReserva = mongoose.model('Reserva', reservaSchema);

export default SchemeReserva;
