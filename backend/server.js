import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import authRoutes from './routes/user-auth-routes.js'
import pinRoutes from './routes/pin-routes.js'
// import profileRoutes from './routes/profileRoutes.js'
// import connectionRoutes from './routes/connectionRoutes.js'
console.log("SERVER FILE LOADED - VERSION 2")
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
// app.use('/api/profile', profileRoutes)
// app.use('/api/connections', connectionRoutes)

app.use('/api/pins', pinRoutes)

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server listening at port number: ${PORT}`)
})

