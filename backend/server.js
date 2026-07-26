import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
// import authRoutes from './routes/authRoutes.js'
// import profileRoutes from './routes/profileRoutes.js'
// import connectionRoutes from './routes/connectionRoutes.js'
const app = express()

app.use(cors())

app.use(express.json())

const connectDB = async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB CONNECTED✅")
    } catch (err) {
        console.log("error while conncting to DB", err.message)
    }
}

connectDB();


app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/connections', connectionRoutes)
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server listening at port number: ${PORT}`)
})

