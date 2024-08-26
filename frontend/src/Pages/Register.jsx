import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  const [userData,setUserData]=useState({
    name:"",
    email:"",
    password:"",
    password2:"",
  })

  const changeInputHandler=(e)=>{
    // When you pass a function to setUserData, that function receives 
    // the current state of userData (before the update) as its argument, which is referred to as prevState.
    setUserData(prevState=>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }
  return (
    <section className='register'>
      <div className="container">
        <h2>
          Sign Up
        </h2>
        <form  className='form register_form'>
          <p className="form_error-message">
            This is an error msg
          </p>
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
