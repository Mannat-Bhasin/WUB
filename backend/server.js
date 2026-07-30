import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import authRoutes from './routes/user-auth-routes.js'
import multer from "multer";
import pinRoutes from './routes/pin-routes.js'
// import Pin from "./models/Pin.js";
// import Photo from "./models/Photo.js";
// import profileRoutes from './routes/profileRoutes.js'
// import connectionRoutes from './routes/connectionRoutes.js'
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

const app = express()

app.use(cors())

app.use(express.json())

const connectDB = async()=>{

    try {
       console.log("URI is:", process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MONGODB CONNECTED✅")
    } catch (err) {
        console.log("error while conncting to DB", err.message)
    }
}

connectDB();




app.use('/api/auth', authRoutes)
app.use('/api/pins', pinRoutes)
// app.use('/api/profile', profileRoutes)
// app.use('/api/connections', connectionRoutes)

app.use((err, req, res, next) => {
  console.log('ERROR NAME:', err.name)
  console.log('ERROR FIELD:', err.field)
  console.log('ERROR MESSAGE:', err.message)
  res.status(500).json({ error: err.message, field: err.field })
})

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server listening at port number: ${PORT}`)
})

