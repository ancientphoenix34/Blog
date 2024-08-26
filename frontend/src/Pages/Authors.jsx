import React, { useState } from 'react'
import avatar from '../Assets/Images/Avatar.jpg'
import { Link } from 'react-router-dom'


const authorData=[
  {id:1,avatar:avatar,name:'Ernest Achiey',posts:3},
  {id:2,avatar:avatar,name:'Jane doe',posts:5},
  {id:3,avatar:avatar,name:'Nick Doe',posts:0},
  {id:4,avatar:avatar,name:'dolemon',posts:3},
  {id:5,avatar:avatar,name:'Erdogan',posts:1},
]

const Authors = () => {

  const [authors,setAuthors]=useState(authorData);

  return (
    <section className='authors'>
      {authors.length>0?<div className="container authors_container">
          {
            authors.map(({id,avatar,name,posts})=>{
              return <Link key={id} to={`/posts/users/${id}`} className='author'>
                <div className="author_avatar">
                  <img src={avatar} alt={`Image of ${name}`} />
                </div>
                <div className="author_info">
                  <h4>{name}</h4>
                  <p>{posts} posts</p>
                </div>
              </Link>
            })
          }
      </div>:<h2 className='center'>No authors found</h2>}

    </section>
  )
}

export default Authors
