import user from '../models/users.js'

export const createUser = async(userdata)=>{
    return user.create(userdata)
}

export const findUserById = async(id)=>{
    return await user.findById(id).select(-"Password")}

export const findUserByIdWithPassword= async(id)=>{
    return await user.findById(id)
}
export const findUserByIdAndUpdate = async(id, update)=>{
    return await user.findByIdAndUpdate(id, update, {new:true}).select('-Password')
}
export const findUserByEmail = async(email)=>{
    return await user.findOne({Email:email})
}


