import React, { useState,useContext,useEffect } from 'react'
import {DUMMY_POSTS} from '../data'
import {Link, Navigate} from 'react-router-dom'
import { UserContext } from '../Context/UserContext';

const Dashboard = () => {

  const [posts,setPosts]=useState(DUMMY_POSTS);


  const {currentUser}=useContext(UserContext)
//currentUser?.token: The optional chaining (?.) checks if currentUser is not null or undefined. If currentUser is a valid object, it accesses the token property.
//If currentUser is null or undefined, the whole expression currentUser?.token will return undefined instead of throwing an error.
  const token=currentUser?.token;

  //redirect to loginpage if not logged in
  useEffect(()=>{
    if(!token){
      Navigate('/login')
    }
  },[])

  return (
   <section className="dashboard">
    {
      posts.length?<div className="container dashboard_container">
{
  posts.map(post=>{
    return <article key={post.id} className='dashboard_post'>
      <div className="dashboard_post-info">
        <div className="dashboard_post_thumbnail">
          <img src={post.thumbnail} className="dashboard_post-thumbnail"alt="" />
        </div>
        <h5>{post.title}</h5>
      </div>
      <div className="dashboard_post-actions">
        <Link to={`/posts/${post.id}`} className='btn sm'>View</Link>
        <Link to={`/posts/${post.id}/edit`} className='btn primary'>Edit</Link>
        <Link to={`/posts/${post.id}/delete`} className='btn danger'>Delete</Link>
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
