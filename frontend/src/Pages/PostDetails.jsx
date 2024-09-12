import React,{useContext,useEffect,useState} from 'react'
import PostAuthor from '../Components/PostAuthor'
import { Link, useParams } from 'react-router-dom'
import Thumbnail from '../Assets/Images/Science.jpg'
import { UserContext } from '../Context/UserContext'
import DeletePost from './DeletePost'
import Loader from '../Components/Loader'
import axios from 'axios'

const PostDetails = () => {
  const {id}=useParams()
  
  const[post,setPost]=useState(null)
  const[creatorID,setCreatorID]=useState(null)
  const[error,setError]=useState(null)
  const[isLoading,setIsLoading]=useState(false)


  const {currentUser}=useContext(UserContext)


  useEffect(()=>{
    const getPost=async()=>{
      setIsLoading(true)
      try{
const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
console.log("first :",response.data)
setPost(response.data)
// console.log("Post creator ID:", post.creator);
// console.log("Current user ID:", currentUser?.id);
// console.log("passing onto usestate",post)
setCreatorID(response.data.creator)
      }
      catch(error){
setError(error)
      }
      setIsLoading(false)
    }
    getPost();
  },[id])

  // Log the post creator after post state has been updated
  useEffect(() => {
    if (post) {
      console.log("after initializing:", post);
      console.log("Post creator ID:", post.creator);
      console.log("Current user ID:", currentUser?.id);
    }
  }, [post, currentUser]);

  if(isLoading){
    return <Loader/>
  }



  return (
    <section className='post-detail'>
      {error && <p className='error'>{String(error)}</p>}
{post && <div className="container post_detail_container">
  <div className="post-detail_header">
    {/* <PostAuthor/> */}
    {currentUser?.id==post?.creator &&
    <div className="post-detail_buttons">
    <Link to={`/posts/werwer/edit`} className='btn btn-primary'>Edit</Link>
<DeletePost/>
  </div>
    }
    
  </div>
  <h1>{post.title}</h1>
  <div className="post-detail_thumbnail">
    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
  </div>
  <p>
   {post.description}
  </p>
</div>}
    </section>
  )
}

export default PostDetails
