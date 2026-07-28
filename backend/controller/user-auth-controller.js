import {signupUser,loginUser} from '../services/user-auth-service.js'

    export const signUp = async(req, res) =>{
        try {
            console.log(req.body);
            const user = await signupUser(req.body)
        
            res.status(201).json({
                success: true,
                message: 'Traveller is Ready',
                ...user
            })
        } catch (err) {
            console.log("Error while signing Up", err)
            res.status(400).json({
                success: false, 
                message: err.message
            })
        }
    }
    
    export const logIn = async(req, res) =>{
        try {
            const userData = await loginUser(req.body)
            
            res.status(200).json({
                success: true,
                message: 'Traveller loggedin succesfully',
                
                ...userData
            })
        } catch (err) {
    
    console.log(err)
    res.status(404).json({
        success: false,
        message: err.message
    })
}
    
    }
