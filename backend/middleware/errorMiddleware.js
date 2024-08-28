//Unsupported
const notFound=(req,res,next)=>{
    const error=new Error(`Not found - ${req.orginalUrl}`)
    res.status(404);
    next(error);
}


//to handle errors
const errorHandler=(error,req,res,next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message || 'An unknown error occured'})
}


module.exports = {notFound,errorHandler}