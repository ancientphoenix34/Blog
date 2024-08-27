const express =require('express');
const cors=require('cors');
const {connect} = require('mongoose');
require('dotenv').config();
const PORT=3000;

const app=express();
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true,origin:`http://localhost:${process.env.PORT}`}));

connect(process.env.MONGO_URI).then(
    app.listen(PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`);
}))
.catch(error=>console.log(error));



