import user from '../models/users.js'

const createuser = async(userdata)=>{
    return user.create(userdata)
}


