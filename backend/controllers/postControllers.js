const Post=require('../models/postModel')
const User=require('../models/userModel')
const path=require('path')
const {v4:uuid}=require('uuid')
const fs=require('fs')
const HttpError=require('../models/errorModel')



const createPost=async(req,res,next)=>{
    try{
let {title,description,category}=req.body;
if(!title || !description || !category || !req.files){
    return next(new HttpError("Please enter all fields",422))
}

const {thumbnail}=req.files

if(thumbnail.size>5000000){
    return next(new HttpError("Thumbnail should be less than 5mb",422))
    }
let fileName=thumbnail.name;
let splittedFilename=fileName.split('.')
let newFilename = splittedFilename[0]+uuid()+'.'+splittedFilename[splittedFilename.length-1]
thumbnail.mv(path.join(__dirname,'..','/uploads',newFilename),async(err)=>{
if(err){
    return next(new HttpError(err))
}else{
    const newPost=await Post.create({
       title,category,description,thumbnail:newFilename,creator:req.user.id 
    })
    if(!newPost){
        return next(new HttpError("Post could'nt be created",422)) 
    }
    //find user and increase post count by one

    const currentUser=await User.findById(req.user.id)
    const userPostCount=currentUser.posts+1
    await User.findByIdAndUpdate(req.user.id,{posts:userPostCount},{new:true})

    res.status(201).json({
        newPost
    })
}
})
    }
    catch(error){
return next(new HttpError(error))
    }
}

    

const getPosts=async(req,res,next)=>{
try{
const posts=await Post.find().sort({updatedAt:-1})
res.status(200).json(posts)
}
catch(error){
    return next(new HttpError(error))
}
}



const getPost=async(req,res,next)=>{
    try{
postId=req.params.id;
const post=await Post.findById(postId)
if(!post){
    return next(new HttpError("Post not found",404))
}
res.status(200).json(post)
}
    catch(error){
        return next(new HttpError(error))
    }
}


const getCatPosts=async(req,res,next)=>{
try{
    const {category}=req.params;
    const catPosts=await Post.find({category}).sort({createdAt:-1})
    res.status(200).json(catPosts)
}
catch(error){
    return next(new HttpError(error))
}
}


const getUserPosts=async(req,res,next)=>{
    try{
const {id}=req.params
const posts=await Post.find({creator:id}).sort({createdAt:-1})
res.status(200).json(posts)
    }
    catch(error){
        return next(new HttpError(error))
    }
}


const editPost=async(req,res,next)=>{
    try{
let fileName;
let newFilename;
let updatedPost;
const postId=req.params.id;

let {title,category,description}=req.body;


//to be compatible with react quill,11 characters will already be there
if(!title || !category || description<12 ){
    return next(new HttpError("Please enter all fields",422))
}

//change post without altering thumbnail
const oldPost=await Post.findById(postId);
if(req.user.id==oldPost.creator){
if(!req.files){
    updatedPost=await Post.findByIdAndUpdate(postId,{title,category,description},{new:true})
}
//thumbnail changing
else{
//get old post
const oldPost=await Post.findById(postId);

//delete old thumbnail
 fs.unlink(path.join(__dirname,'..','uploads',oldPost.thumbnail),async(err)=>{
    if(err){
        return next(new HttpError(err))
    }
   
})
 //upload new thumbnail
 const {thumbnail}=req.files
 if(thumbnail.size>5000000){
     return next(new HttpError("Thumbnail should be less than 5mb",422))
 }
 fileName=thumbnail.name;
 let splittedFilename=fileName.split('.')
 newFilename=splittedFilename[0]+uuid()+'.'+splittedFilename[splittedFilename.length-1]
 thumbnail.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
   if(err){
     return next(new HttpError(err))
   }  
 })
 updatedPost=await Post.findByIdAndUpdate(postId,{title,category,description,thumbnail:newFilename},{new:true})
}
}

if(!updatedPost){
    return next(new HttpError("Post could'nt be updated",422))
}
res.status(200).json(updatedPost)

    }
    
    catch(error){
        return next(new HttpError(error))
    }
}




const deletePost=async(req,res,next)=>{
try{
const postId=req.params.id;
if(!postId){
    return next(new HttpError("Post not found",404))
}
const post=await Post.findById(postId)
const fileName=post?.thumbnail;
//del pic from uploads
if(req.user.id==post.creator){
fs.unlink(path.join(__dirname,'..','uploads',fileName),async(err)=>{
    if(err){
        return next(new HttpError(err))
    }else{
await Post.findByIdAndDelete(postId);

//post count

const currentUser=await User.findById(req.user.id)
const userPostCount=currentUser?.posts-1
await User.findByIdAndUpdate(req.user.id,{posts:userPostCount},{new:true})
res.json(`Post ${postId} deleted successfully`)
    }
})
}else{
    return next(new HttpError("You are not authorized to delete this post",403))
}
}catch(error){
 return next(new HttpError(error))
}
}




module.exports={createPost,getPosts,getPost,getCatPosts,getUserPosts,editPost,deletePost}