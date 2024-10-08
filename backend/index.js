const express =require('express');
const cors=require('cors');
const {connect} = require('mongoose');
require('dotenv').config();
const PORT=5000;
const upload=require('express-fileupload')


const userRoutes=require('./routes/userRoutes')
const postRoutes=require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const app=express();

app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({ credentials: true,  origin: 'https://blog-frontend-u5q6.onrender.com' }));
// file upload
app.use(upload());
app.use('/uploads',express.static(__dirname+'/uploads'))



// This mounts all routes defined in userRoutes and postRoutes at the /api/users base path.
app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)

app.use(notFound);
app.use(errorHandler)


connect(process.env.MONGO_URI).then(
    app.listen(PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`);
}))
.catch(error=>console.log(error));



