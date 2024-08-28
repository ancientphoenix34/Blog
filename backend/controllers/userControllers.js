const User = require("../models/userModel")
const HttpError = require("../models/errorModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



// -------register user------
const registerUser=async(req,res,next)=>{
try{
    const {name,email,password,password2}=req.body;
    if(!name || !email || !password){
        return next(new HttpError("Please enter all fields",422))
    }
    const newEmail=email.toLowerCase();

    const emailExist=await User.findOne({email:newEmail})

    if(emailExist){
        return next(new HttpError("Email already exists",422))
    }

    if((password.trim()).length<6){
        return next(new HttpError("Password must be at least 6 characters",422))
    }

    if(password!==password2){
         return next(new HttpError("Passwords do not match",422))
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt);


    const newUser =await User.create(
        {name,email:newEmail,password:hashedPassword}
    )

    res.status(201).json(`New user created: ${newUser.email}`)


}catch(error){
    console.error("Error in registerUser:", error); // Log the error for debugging
    return next(new HttpError("Something went wrong", 500));}
}


// ----------login user-------
const loginUser=async(req,res,next)=>{
    try{
const {email,password}=req.body;
if(!email || !password){
    return next(new HttpError("please enter all fields",422))
}

const newEmail=email.toLowerCase();

const user=await User.findOne({email:newEmail})

if(!user){
    return next(new HttpError("Invalid credentials",422))
}
const comparePass=await bcrypt.compare(password,user.password)

if(!comparePass){
    return next(new HttpError("Invalid credentials",422))
}

const{_id:id,name}=user;
const token=jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"})
res.send({token,id,name})
    }
    catch(error){
return next(new HttpError("Something went wrong,please check your credentials", 422))
    }
}


// ----------user profile----------
const getUser=async(req,res,next)=>{
    res.json("user profile")
}

// ----------change avatar---------
const changeAvatar=async(req,res,next)=>{
    res.json("change avatar")
    }



// ---------edit user--------
const editUser=async(req,res,next)=>{
        res.json("edit user")
        }


// ----------get authors--------
 const getAuthors=async(req,res,next)=>{
 res.json("get all authors")    
  }


 module.exports={registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors} 