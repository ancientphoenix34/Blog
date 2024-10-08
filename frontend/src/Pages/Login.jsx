import React, { useState,useContext } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../Context/UserContext'

const Login = () => {
  const [userData,setUserData]=useState({
    email:"",
    password:"",
  })

  const [error,setError]=useState("")
const navigate=useNavigate();

const {setCurrentUser}=useContext(UserContext)

  const changeInputHandler=(e)=>{
    // When you pass a function to setUserData, that function receives 
    // the current state of userData (before the update) as its argument, which is referred to as prevState.
    setUserData(prevState=>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }

  const loginUser=async(e)=>{
e.preventDefault();
setError("")
try{
const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`,userData)
const url=(`${process.env.REACT_APP_BASE_URL}/users/login`)
console.log(url)
const user=await response.data;
setCurrentUser(user)
navigate("/")
}
catch(err){
setError(err.response.data.message)
console.error("Error fetching post:", error);
}
  }
  return (
    <section className='login'>
      <div className="container">
        <h2>
          Sign In
        </h2>
        <form  className='form register_form' onSubmit={loginUser}>
          {error &&<p className="form_error-message">
            {error}
          </p>}
          <input type="email" placeholder='E-mail' name='email' value={userData.email} onChange={changeInputHandler} autoFocus/>
          <input type="password" placeholder='Enter password' name='password' value={userData.password} onChange={changeInputHandler}/>
          <button type='submit' className='btn primary'>Login</button>
        </form>
        <small>Don't have an account?<Link to="/register">Sign in</Link> </small>
      </div>

    </section>
  )
}

export default Login
