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

app.get('/reserva/:id', async(req, res)=>{
    try{
        const {id} = req.params

        const reserva = await SchemeReserva.findById(id)
        if(!reserva){
            return res.status(404).json({
                success: false,
                message: `Usuario con ID ${id} no encontrado`
            })
        }

        res.status(200).json({
            success: true,
            data: reserva
        })

    }catch(error){
       res.status(500).json({
        success: false,
        message: 'Error al momento de  consultar los datos',
        error: error.message
       }) 
    }
})

app.put('/reserva/:id', async(req, res)=>{
    try{
        const {id} = req.params
        const updated = req.body
        const updatedService = await SchemeReserva.findByIdAndUpdate(id, updated,{
            new: true,
            runValidators: true,
        })

        if(!updatedService){
            return res.status(404).json({
                success: false,
                message: 'Error al momento de consultar los datos'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Se actualizaron los datos correctamente',
            data: updatedService
        })


    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error almomento de consultar los datos de la reserva'
        })
    }
})

app.put('/reserva/:id/estado', async(req, res)=>{
    try{
        const {id} = req.params
        const estado = req.body

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({
                success: false,
                message: 'Erro al momento de actualizar el estado'
            })
        }

        const updatedStatus = await SchemeReserva.findOneAndUpdate(
            {_id: id},
            {estado},
            {new: true}
        )

        if(!updatedStatus){
            return res.status(404).json({
                success: false,
                message: 'Error al actualizar el estado'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Se actualizo el estado correctamente',
            data: updatedStatus
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al momento de actualizar el dato',
            error: error.message,
        })
    }
})
console.log('siu')
app.listen(port, () =>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
