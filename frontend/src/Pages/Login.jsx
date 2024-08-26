import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [userData,setUserData]=useState({
    email:"",
    password:"",
  })

  const changeInputHandler=(e)=>{
    // When you pass a function to setUserData, that function receives 
    // the current state of userData (before the update) as its argument, which is referred to as prevState.
    setUserData(prevState=>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }
  return (
    <section className='login'>
      <div className="container">
        <h2>
          Sign In
        </h2>
        <form  className='form register_form'>
          <p className="form_error-message">
            This is an error msg
          </p>
          <input type="email" placeholder='E-mail' name='email' value={userData.email} onChange={changeInputHandler}/>
          <input type="password" placeholder='Enter password' name='password' value={userData.password} onChange={changeInputHandler}/>
          <button type='submit' className='btn primary'>Login</button>
        </form>
        <small>Don't have an account?<Link to="/register">Sign in</Link> </small>
      </div>

    </section>
  )
}

export default Login
