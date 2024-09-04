const User = require("../models/userModel")
const HttpError = require("../models/errorModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs=require('fs')
const path=require('path')
const {v4:uuid}=require('uuid')




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
try{
const {id}=req.params;
// exclude the password field from the returned user object
const user=await User.findById(id).select("-password")
if(!user){
    return next(new HttpError("User not found",404))
}
res.status(200).json(user)
}catch(error){
    return next(new HttpError(error))

}
}

// ----------change avatar---------
const changeAvatar=async(req,res,next)=>{
    try{
       if(!req.files.avatar){
           return next(new HttpError("Please upload an image",422))
       }

       const user=User.findById(req.user.id)
    //    delete old avatar if exist
       if(user.avatar){
         fs.unlink(path.join(__dirname,'..',user.avatar),(err)=>{
            if(err){
                return next(new HttpError(err))
            }
         })
       }
       const {avatar}=req.files
       if(avatar.size>5000000){
        return next(new HttpError("Please upload an image less than 5MB",422))
       }

       let fileName;
       fileName=avatar.name;
       let splittedFileName=fileName.split(".")
       let newFilename=splittedFileName[0]+uuid()+'.'+splittedFileName[splittedFileName.length-1]
       avatar.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
        if(err){
            return next(new HttpError(err))
        }
        const updatedAvatar= await User.findByIdAndUpdate(req.user.id,{avatar:newFilename},{new:true})
        if(!updatedAvatar){
            return next(new HttpError("Something went wrong",422))
    }
res.status(200).json(updatedAvatar)
})
}
catch(error){
        return next(new HttpError(error))
    }
    }



// ---------edit user--------
const editUser=async(req,res,next)=>{
    try{
const{name,email,currentPassword,newPassword,confirmNewPassword}=req.body;
if(!name || !email || !currentPassword || !newPassword){
    return next(new HttpError("Fill in all the fields",422))
}
const user=await User.findById(req.user.id);
if(!user){
return next(new HttpError("User not found",403))
}
const emailExist=await User.findOne({email});
if(emailExist && (emailExist.id !=req.user.id)){
    return next(new HttpError("Email already exist",422))
    }
    const validateUserPassword=await bcrypt.compare(currentPassword,user.password)
    if(!validateUserPassword){
        return next(new HttpError("Invalid current password",422));
    }

    if(newPassword!==confirmNewPassword){
        return next(new HttpError("new password does not match",422))
    }

    //hash new password
    const salt=await bcrypt.genSalt(10)
    const hash=await bcrypt.hash(newPassword,salt);


    const newInfo=await User.findByIdAndUpdate(req.user.id,{name,email,password:hash},{new:true})
    res.status(200).json(newInfo);
}
    catch(error){
return next(new HttpError(error))
    }
};


// ----------get authors--------
 const getAuthors=async(req,res,next)=>{
    try{
        const authors=await User.find().select('-password')
        res.json(authors);
    }
    catch(error){
        return next(new HttpError(error))
    }
  }


 module.exports={registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors} 