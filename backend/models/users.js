
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: true
    },

    Email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },

    Password:{
        type:String,
        required:true,

    },

    DOB:{
        type:Date,

    }, 

    Profileimage:{
        type:String,
        default:"https://i.pinimg.com/736x/89/3d/2f/893d2fa9c21b82468c8448cc99f15ee0.jpg"
    },

    Bio:{
        type: String,
        maxlength:250
    },

    Gender:{
        type:String,
        enum:["Female","Male","Prefer not to say"]
    }
},{timestamps:true})

const user = mongoose.model('user',userSchema)
export default user