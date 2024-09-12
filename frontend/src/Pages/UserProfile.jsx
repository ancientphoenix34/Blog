import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../Assets/Images/Avatar.jpg'
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from '../Context/UserContext'


const UserProfile = () => {

  const [avatar,setAvatar]=useState(Avatar);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [currentPassword,setCurrentPassword]=useState('');
  const [newPassword,setNewPassword]=useState('');
  const [confirmNewPassword,setConfirmNewPassword]=useState('');
  
  const navigate=useNavigate();

  const {currentUser} = useContext(UserContext)
  const token=currentUser?.token


  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  })
  
  return (
   <section className='profile'>

    <div className="container profile_container">
      <Link to={`/myposts/sdfsd`}>
      My posts
      </Link>
      <div className="profile_details">
        <div className="avatar_wrapper">
          <div className="profile_avatar">
            <img src={avatar} alt="" />
          </div>
          {/* Form to update avatar */}
          <form className='avatar_form'>
            <input type="file" name='avatar' id='avatar' accept='png,jpg,jpeg' onChange={e=>setAvatar(e.target.files[0 ])}/>
            <label htmlFor="avatar"><FaEdit /></label>
          </form>
          <button className='profile_avatar-btn'><FaCheck /></button>
        </div>
        <h1>Ernest Achiey</h1>
        <form className="form profile_form">
          <p className="form_error-message">
            This is an error msg
          </p>
          <input type="text"  placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)}/>
          <input type="email"  placeholder='E-mail' value={email} onChange={e=>setEmail(e.target.value)}/>
          <input type="password"  placeholder='Current password' value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/>
          <input type="password"  placeholder='New password' value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
          <input type="password"  placeholder='Confirm new password' value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)}/>
          <button type='submit' className='btn primary'>Update</button>
        </form>
      </div>
    </div>
   </section>
  )
}

export default UserProfile
