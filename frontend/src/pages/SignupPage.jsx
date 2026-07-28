import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const PageSignup =  ()=>{
const navigate = useNavigate()
const[loading, setLoading] = useState(false)
const[formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: ''
})
const[toast, setToast] = useState(null)

useEffect(()=>{
if(toast){
    const timerId = setTimeout(()=>{
            setToast(null)
    },3000)

    return ()=>clearTimeout(timerId)
}
},[toast])


const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
}


const handleSubmit = async (e) =>{
    e.preventDefault()


 try {   
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/auth/signup',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
    
        const data = await response.json()

        if(!response.ok){
          setToast({message: "Failed to Get a Good Response", type: 'error'})
            throw new Error(data.message )
            
        }

        setToast({message: "Signup Successfully Done", type: 'success'})
        setTimeout(()=>{navigate('/login')},1500)

} catch (err) {
        setToast({message: err.message, type: 'error'})
        setTimeout(()=>{navigate('/signup')},1500)
        
} finally {
    setLoading(false)
}
}

return <>
 <div className='relative h-screen w-screen overflow-hidden'>
<img className= 'absolute inset-0 h-full w-full object-cover opacity-65 -z-10 ' src="/Signup-Bg-Img1.png" alt="BG-Image" />
{/* <button className="glass glass-interactive glass-text absolute rounded-full px-4 py-1.5 text-sm font-normal text-xl mt-5">Hello</button> */}
<div className='relative flex flex-col gap-10 justify-center items-center px-0 py-1.5 font-normal w-[500px] mt-20 ml-200 z-10 '>

<fieldset className='fieldset bg-base-200 border-base-300 rounded-box border p-4 glass glass-interactive glass-text h-[75vh] rounded-[15px] px-5 w-full mb-5 '>
   
{/*     
  <legend className="fieldset-legend">Login</legend> */}
<h1 className="text-3xl font-bold text-black mb-4 text-center">Sign Up</h1>

  <label className="label text-lg  text-black" >Traveller's User-name:</label>
  <input type="name" className="input text-lg  text-black" value={formData.Name}
  onChange={handleChange} name='Name' placeholder="User-Name" />
  
  <label className="label text-lg  text-black">Traveller's Email</label>
  <input type="email" className="input text-lg  text-black" value={formData.Email}
  onChange={handleChange} placeholder="Email" name='Email' />

  <label className="label text-lg  text-black">Traveller's Password</label>
  <input type="password" className="input text-lg  text-black" value={formData.Password}
  onChange={handleChange} name='Password' placeholder="Password" />

  <button className="bg-blue-500 text-white  text-lg px-4 py-2 rounded w-35 mt-4" onClick={handleSubmit}>Sign In</button>

    {/* <p>Traveller's User Name:</p>
  <input
    type="text"
    className="border rounded px-2 py-1"
  />
<button className=" bg-blue-500 text-white px-4 py-2 rounded w-35" onClick={handleSubmit}>
  Sign Up
</button> */}

</fieldset>
</div>
</div>

</>


}
export default PageSignup