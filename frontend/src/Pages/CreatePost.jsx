import React, { useState,useContext, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { UserContext } from '../Context/UserContext'
import { Navigate } from 'react-router-dom'


const CreatePost = () => {
  const [title,setTitle]=useState('')
  const [category,setCategory]=useState('')
  const [description,setDescription]=useState('')
  const [thumbnail,setThumbnail]=useState('')


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

  const modules = {
    toolbar: [
    [{'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
     ['link', 'image'],
    ['clean']
    ],
  }


const formats = [
'header',
'bold', 'italic', 'underline', 'strike', 'blockquote',
'list', 'bullet', 'indent', 
'link', 'image'
]


const POST_CATEGORIES=[
"Agriculture","Business","Education","Entertiement","Art","Investment","Uncategorized","Weather"
]

  return (
   <section className="create-class">
    <div className="container">
      <h2>Create Post</h2>
      <p className="form_error-message">
        This is an error
      </p>
      <form  className="form create-post_form">
        <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} autoFocus/>
<select name="category" value={category} onChange={e=>setCategory(e.target.value)}>
{
  POST_CATEGORIES.map(cat=> <option key={cat} >{cat}</option>)
}
</select>
<ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription}/>
<input type="file" onChange={e=>setThumbnail(e.target.files[0])} accept='png,jpg,jpeg' />
<button type='submit' className='btn primary'>Create</button>
      </form>
    </div>
   </section>
  )
}

export default CreatePost
