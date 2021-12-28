// Creating token and storing in cookie

const sendtoken=(user,statusCode,res)=>{
    const token =user.getJWTToken();

    //option for cookie
    const options={
        expiresIn: Date.now + process.env.COOKIE_EXPIRE * 24 *60 * 60 * 1000,
        
        
        httpOnly:true,
    
    }

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token,
        user,
    })
        
}

module.exports=sendtoken