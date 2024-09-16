import React, { useState,useContext,useEffect } from 'react'
import {DUMMY_POSTS} from '../data'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { UserContext } from '../Context/UserContext';
import Loader from '../Components/Loader';
import axios from 'axios';
import DeletePost from './DeletePost';
const Dashboard = () => {
  const [posts,setPosts]=useState([])
  const {currentUser}=useContext(UserContext)
  const [isLoading,setIsLoading]=useState(false)
  const {id}=useParams();
//currentUser?.token: The optional chaining (?.) checks if currentUser is not null or undefined. If currentUser is a valid object, it accesses the token property.
//If currentUser is null or undefined, the whole expression currentUser?.token will return undefined instead of throwing an error.
  const token=currentUser?.token;
const navigate=useNavigate();
  //redirect to loginpage if not logged in
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[])



  useEffect(()=>{
const fetchPosts=async()=>{
  setIsLoading(true);
  try{
const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}});
setPosts(response?.data);
  }
  catch(error){
    console.log(error)
  }
  setIsLoading(false);
}
fetchPosts();
  },[])

if(isLoading){
  return <Loader/>
}


  return (
   <section className="dashboard">
    {
      posts.length?<div className="container dashboard_container">
{
  posts.map(post=>{
    return <article key={post.id} className='dashboard_post'>
      <div className="dashboard_post-info">
        <div className="dashboard_post_thumbnail">
          <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} className="dashboard_post-thumbnail"alt="" />
        </div>
        <h5>{post.title}</h5>
      </div>
      <div className="dashboard_post-actions">
        <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
        <Link to={`/posts/${post._id}/edit`} className='btn primary'>Edit</Link>
        <DeletePost postId={post._id}/>
      </div>
      </article>
  })
}
      </div>:<h2 className='center'>No posts found</h2>
    }
   </section>
  )
}

export default Dashboard
