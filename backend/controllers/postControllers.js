const Post = require('../models/postModel')
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')
const { uploadImage, deleteImage } = require('../utils/cloudinary')


const createPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body
    if (!title || !description || !category || !req.files) {
      return next(new HttpError('Please enter all fields', 422))
    }
    const { thumbnail } = req.files
    if (thumbnail.size > 5000000) {
      return next(new HttpError('Thumbnail should be less than 5MB', 422))
    }
    const thumbnailUrl = await uploadImage(thumbnail.data, 'blog/thumbnails')
    const newPost = await Post.create({ title, category, description, thumbnail: thumbnailUrl, creator: req.user.id })
    if (!newPost) {
      return next(new HttpError("Post couldn't be created", 422))
    }
    const currentUser = await User.findById(req.user.id)
    await User.findByIdAndUpdate(req.user.id, { posts: currentUser.posts + 1 }, { new: true })
    res.status(201).json({ newPost })
  } catch (error) {
    return next(new HttpError(error))
  }
}


const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 })
    res.status(200).json(posts)
  } catch (error) {
    return next(new HttpError(error))
  }
}


const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return next(new HttpError('Post not found', 404))
    }
    res.status(200).json(post)
  } catch (error) {
    return next(new HttpError(error))
  }
}


const getCatPosts = async (req, res, next) => {
  try {
    const catPosts = await Post.find({ category: req.params.category }).sort({ createdAt: -1 })
    res.status(200).json(catPosts)
  } catch (error) {
    return next(new HttpError(error))
  }
}


const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ creator: req.params.id }).sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (error) {
    return next(new HttpError(error))
  }
}


const editPost = async (req, res, next) => {
  try {
    const postId = req.params.id
    const { title, category, description } = req.body
    if (!title || !category || description < 12) {
      return next(new HttpError('Please enter all fields', 422))
    }
    const oldPost = await Post.findById(postId)
    if (req.user.id != oldPost.creator) {
      return next(new HttpError('Not authorized to edit this post', 403))
    }
    let updatedPost
    if (!req.files) {
      updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
    } else {
      const { thumbnail } = req.files
      if (thumbnail.size > 5000000) {
        return next(new HttpError('Thumbnail should be less than 5MB', 422))
      }
      await deleteImage(oldPost.thumbnail)
      const thumbnailUrl = await uploadImage(thumbnail.data, 'blog/thumbnails')
      updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: thumbnailUrl }, { new: true })
    }
    if (!updatedPost) {
      return next(new HttpError("Post couldn't be updated", 422))
    }
    res.status(200).json(updatedPost)
  } catch (error) {
    return next(new HttpError(error))
  }
}


const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id
    if (!postId) {
      return next(new HttpError('Post not found', 404))
    }
    const post = await Post.findById(postId)
    if (req.user.id != post.creator) {
      return next(new HttpError('You are not authorized to delete this post', 403))
    }
    await deleteImage(post.thumbnail)
    await Post.findByIdAndDelete(postId)
    const currentUser = await User.findById(req.user.id)
    await User.findByIdAndUpdate(req.user.id, { posts: currentUser.posts - 1 }, { new: true })
    res.json(`Post ${postId} deleted successfully`)
  } catch (error) {
    return next(new HttpError(error))
  }
}


module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost }
