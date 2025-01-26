import e from "express";
import mongoose from "mongoose";
import dotenv  from 'dotenv'
import SchemeReserva from './models/Reserva.js'
import cors from 'cors'

dotenv.config()

const app = e()
const port = process.env.PORT || 3001;

app.use(cors())


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log('Conexion exitosa a MongoDB'))
.catch((error) => console.error('error al conectar a MongoDB', error))

app.use(e.json())

app.get('/reserva', async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
        };

        const reserva = await SchemeReserva.paginate({}, options);

        res.status(200).json({
            success: true,
            data: reserva
        });
    } catch (error) {
        console.error('Error al consultar las reservas:', error); 
        res.status(500).json({
            success: false,
            message: 'Error al consultar los datos',
            error: error.message
        });
    }
});

app.post('/reserva', async (req, res) => {
    console.log('Datos recibidos en la solicitud:', req.body);  

    try {
        const { nombre, numeroTelefonico, email, cantClientes, fechaReserva, horaReserva, estado } = req.body;

        // Verifica si todos los campos son enviados correctamente
        if (!nombre || !numeroTelefonico || !email || !cantClientes || !fechaReserva || !horaReserva || !estado) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const newReserva = await SchemeReserva.create({
            nombre,
            numeroTelefonico,
            email,
            cantClientes,
            fechaReserva,
            horaReserva,
            estado,
        });

        res.status(200).json({
            success: true,
            message: "Reserva registrada correctamente",
            data: newReserva
        });
    } catch (error) {
        console.error('Error al insertar la reserva:', error);  
        res.status(500).json({
            success: false,
            message: 'Error al insertar los datos',
            error: error.message
        });
    }
});

app.get('/reserva', async()=>{
    
})

app.put('/reserva', async()=>{

})

app.listen(port, () =>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
