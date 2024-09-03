const {Router} = require('express')

const router=Router();


const {createPost,getPosts,getPost,getCatPosts,getUserPosts,editPost,deletePost}=require('../controllers/postControllers') 
const authMiddleware=require('../middleware/authMiddleware')


router.post('/',authMiddleware,createPost)
router.get('/',getPosts)
router.get('/:id',getPost)
router.patch('/:id',authMiddleware,editPost)
router.get('/categories/:category',getCatPosts)
router.get('/users/:id',getUserPosts)
router.delete('/:id',authMiddleware,deletePost)

module.exports = router