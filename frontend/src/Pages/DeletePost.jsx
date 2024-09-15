import React, { useContext,useEffect } from 'react'
import { UserContext } from '../Context/UserContext';
import { Link, Navigate } from 'react-router-dom';

const DeletePost = () => {

  const {currentUser}=useContext(UserContext)
//currentUser?.token: The optional chaining (?.) checks if currentUser is not null or undefined. If currentUser is a valid object, it accesses the token property.
//If currentUser is null or undefined, the whole expression currentUser?.token will return undefined instead of throwing an error.
  const token=currentUser?.token;

  //redirect to login page if not logged in
  useEffect(()=>{
    if(!token){
      Navigate('/login')
    }
  },[])

  return (
    <div>
      <Link className='btn sm danger'>Delete</Link>
      
    </div>
  )
}

export default DeletePost
