const {Schema,model}=require('mongoose')

const postSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:['Agriculture','Business','Education','Entertainment','Art','Investment','Uncategorized','Weather'],
        message:'Invalid category'
    },
    description:{
        type:String,
        required:true,   
    },
    creator:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }, 
    thumbnail:{
        type:String,
        required:true,
    }
},
{timestamps:true})


module.exports=model('Post',postSchema)