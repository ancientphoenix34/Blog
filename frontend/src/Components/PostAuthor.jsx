import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../Assets/Images/Avatar.jpg'

const PostAuthor = () => {
  return (
    <Link to={`/posts/users/sdfsdf`} className='post_author'>
      <div className="post_author-avatar">
        <img src={Avatar} alt="" />
      </div>
      <div className="post_author-details">
        <h5>Ernest Achiey</h5>
        <small>Just now</small>
      </div>
    </Link>
  )
}

export default PostAuthor
