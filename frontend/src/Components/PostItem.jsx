import React from 'react'
import {Link} from 'react-router-dom'
import PostAuthor from './PostAuthor'

const PostItem = ({postID,thumbnail,title,description,authorID,category}) => {

  const shortDescription=description.length>145?description.substr(0,145)+'...':description;
  const shortTitle=title.length>20?title.substr(0,20)+'...':title;
  return (
    <div>
      <article className="post">
        <div className="post_thumbnail">
            <img src={thumbnail} alt={title} />
        </div>
        <div className="post_content">
            <Link to={`/posts/${postID}`}>
            <h3>{shortTitle}</h3>
            </Link>
            <p>{shortDescription}</p>
            <div className="post_footer">
                <PostAuthor/>
                <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
            </div>
        </div>
      </article>
    </div>
  )
}

export default PostItem
