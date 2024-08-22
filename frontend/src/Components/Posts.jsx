import React, { useState } from 'react'
import thumbnail1 from '../Assets/Images/Science.jpg'
import PostItem from './PostItem'





const DUMMY_POSTS = [
    {
      id: '1',
      thumbnail: thumbnail1,
      category: 'science',
      title: 'this is the title of post 1 and merry chritsmas',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit dhfg uod  fgareqw  iondpe infoew.',
      authorID: 1
    },
    {
      id: '2',
      thumbnail: thumbnail1,
      category: 'science',
      title: 'this is the title of post 1',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      authorID: 3
    },
    {
      id: '5',
      thumbnail: thumbnail1,
      category: 'education',
      title: 'this is the title of post 1',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      authorID: 9
    },
    {
      id: '3',
      thumbnail: thumbnail1,
      category: 'weather',
      title: 'this is the title of post 1',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      authorID: 13
    },
    {
      id: '4',
      thumbnail: thumbnail1,
      category: 'weather',
      title: 'this is the title of post 1',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      authorID: 7
    },

  ];
const Posts = () => {
    const[posts,setPosts]=useState(DUMMY_POSTS);

  return (

    <section className='posts'>
<div className="container posts_container">
{
    posts.map(({id,thumbnail,category,title,desc,authorID})=> 
    <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title} description={desc} authorID={authorID}/>)
}
</div>
    </section>
  );
};

export default Posts;
