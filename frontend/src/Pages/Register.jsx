import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [userData,setUserData]=useState({
    name:"",
    email:"",
    password:"",
    password2:"",
  })

  const [error,setError]=useState("")
  const navigate=useNavigate();

  const changeInputHandler=(e)=>{
    // When you pass a function to setUserData, that function receives 
    // the current state of userData (before the update) as its argument, which is referred to as prevState.
    setUserData(prevState=>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }


  const registerUser=async(e)=>{
    e.preventDefault();
    setError("")
    try{
const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`,userData)
const newUser=await response.data;
if(!newUser){
  setError("Could'nt register user, please try again")
}
navigate("/login")
    }catch(err){
setError(err.response.data.message)
    }
  }
  return (
    <section className='register'>
      <div className="container">
        <h2>
          Sign Up
        </h2>
        <form  className='form register_form' onSubmit={registerUser}>
          {error &&<p className="form_error-message">
            {error}
          </p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler}/>
          <input type="email" placeholder='E-mail' name='email' value={userData.email} onChange={changeInputHandler}/>
          <input type="password" placeholder='Enter password' name='password' value={userData.password} onChange={changeInputHandler}/>
          <input type="password" placeholder='Re-enter password' name='password2' value={userData.password2} onChange={changeInputHandler}/>
          <button type='submit' className='btn primary'>Register</button>
        </form>
        <small>Already have an account?<Link to="/login">Sign in</Link> </small>
      </div>

    </section>
  )
}

export default Register
