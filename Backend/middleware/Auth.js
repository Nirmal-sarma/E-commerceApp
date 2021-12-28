const catchAsyncError = require("./catchAsyncError");
const ErrorHandler=require('../Utils/ErrorHandler');
const jwt=require('jsonwebtoken');
const User= require('../model/UserModel');


exports.isAuthenticated=catchAsyncError(
async(req,res,next)=>{
       const { token }=req.cookies;
        
        if(!token){
            return next(new  ErrorHandler("Please login to access the resourses",401))
        }

     const decodedData=jwt.verify(token,process.env.JWT_SECRET);
   
     req.user=await User.findById(decodedData.id);
   
     next();
})

exports.authorisedRoles= (...roles)=>{
    return (req,res,next)=>{
       
    
        if(!roles.includes(req.user.role)){
         return res.status(403).json({
             success:false,
             message:`The ${req.user.role} is not allowed to acess the data`
         })
      }
       next();
}
    
}

