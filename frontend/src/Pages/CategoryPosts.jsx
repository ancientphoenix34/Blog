import React from 'react'
import { useState } from 'react'
import PostItem from '../Components/PostItem'
import { DUMMY_POSTS } from '../data'


const CategoryPosts = () => {

  const[posts,setPosts]=useState(DUMMY_POSTS);
  return (
    <section className='container posts_container'>
{posts.length>0?<div className="container author_posts-container">
{
    posts.map(({id,thumbnail,category,title,desc,authorID})=> 
    <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title} description={desc} authorID={authorID}/>)
}
</div>:<h2 className='center'>No posts found</h2>}
    </section>
  )
}

export default CategoryPosts
