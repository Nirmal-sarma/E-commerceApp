const ErrorHandler=require('../Utils/ErrorHandler');

module.exports=(err,req,res,next)=>{
    err.statusCode =err.statusCode || 500;
    err.message=err.message || "Internal Server Error";

// mongoDb id error
if(err.name === "CastError"){
    const message=`resource not found.Invalid:${err.path}`
    err=new ErrorHandler(message,400);
}

// Mongoose duplicate code error

if(err.name === 11000 ){
    const message=`Duplicate ${object.keys(err.keyValue)} Entered`;
    err=new ErrorHandler(message,400);
}

if(err.name === 'JsonWebTokenError'){
    const message=`Json Web token is invalid try again`;
    err=new ErrorHandler(message,400);
}

if(err.name === 'TokenExpireError'){
    const message=`Json Web token is Expire, Try again`;
    err=new ErrorHandler(message,400);
}

res.status(err.statusCode).json({
        success:false,
        message:err.message,
})
    
}