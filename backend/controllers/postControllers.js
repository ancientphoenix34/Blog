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
    catch{
        return next(new HttpError(error))
    }
}


const editPost=async(req,res,next)=>{
    res.json("Edit")
}




const deletePost=async(req,res,next)=>{
    res.json("delete post")
}




module.exports={createPost,getPosts,getPost,getCatPosts,getUserPosts,editPost,deletePost}