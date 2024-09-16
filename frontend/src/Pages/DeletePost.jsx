import React, { useContext,useEffect,useState } from 'react'
import { UserContext } from '../Context/UserContext';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
const DeletePost = ({postId:id}) => {

  const {currentUser}=useContext(UserContext)
//currentUser?.token: The optional chaining (?.) checks if currentUser is not null or undefined. If currentUser is a valid object, it accesses the token property.
//If currentUser is null or undefined, the whole expression currentUser?.token will return undefined instead of throwing an error.
  const token=currentUser?.token;
const navigate=useNavigate();
const location=useLocation();
const [isLoading,setIsLoading]=useState(false);
  //redirect to login page if not logged in
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[])


  const removePost=async()=>{
    setIsLoading(true);
    try{
const response=await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}});
if(response && response.status === 200){
  if(location.pathname== `/myposts/${currentUser.id}`){
    navigate(0)
} else{
  navigate('/')
}   
}
setIsLoading(false);
    }
    catch(err){
      console.log(err);
      
    }
  }


  if(isLoading){
    return <Loader/>
  }

  return (
    <div>
      <Link className='btn sm danger' onClick={()=>removePost(id)}>Delete</Link>
      
    </div>
  )
}

export default DeletePost
