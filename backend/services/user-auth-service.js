
import { findUserByEmail, createUser } from "../repositories/user-repo.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const signupUser = async(userData)=>{
    const signedIn = await findUserByEmail(userData.Email)
    if(signedIn){
        throw new Error(" User is Already Registered") 
    }
    
     userData.Password = await bcrypt.hash(userData.Password, 10);

     const newUser = await createUser(userData);
     return {userId: newUser._id, Username:newUser.Name, Email: newUser.Email, Bio: newUser.Bio, Gender: newUser.Gender, ProfileImg: newUser.Profileimage, Age: calculateAge(newUser.DOB), Dob: newUser.DOB}
}


const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};


export const loginUser = async(userData)=>{
    
    const Exists = await findUserByEmail(userData.Email)
    if(!Exists){
        throw new Error(" Traveller needs to SignIn first") 
    }
     const isMatch = await bcrypt.compare(userData.Password, Exists.Password)
    
        if(!isMatch){
            throw new Error("Invalid email or password")
        }
     console.log("JWT_SECRET:", process.env.JWT_SECRET)
     const token = await jwt.sign({userId: Exists._id},process.env.JWT_SECRET, {expiresIn: '24h'})    
    
     return {token, userId: Exists._id, Username:Exists.Name, Email: Exists.Email, Bio: Exists.Bio, Gender: Exists.Gender, ProfileImg: Exists.Profileimage, Age: calculateAge(Exists.DOB), Dob: Exists.DOB}
}