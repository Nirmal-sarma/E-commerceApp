const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please enter Product Name"],
        maxlength:[30,"Name Cannot exceed 30 character"],
        minlength:[4,"name should be greater then 4 letter"],
    },
    email:{
        type:String,
        required: [true,"Please enter Product Name"],
        unique:true,
        validate:[validator.isEmail,"Please enter the valid email"],
    },
     password:{
         type:String,
         required:true,
         maxlength:[15,"Password must atleast 8 character"],
         select:false,
    },
     avatar:{
        public_Id: {
            type: String,
        
          },
          url: {
            type: String,
           
          },
     },
     role:{
         type:String,
         default:"user",
    },

     resetPasswordToken:String,
     resetPasswordExpire:Date,

})

userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
       next();
    }
    this.password=await bcrypt.hash(this.password,10);
})

//jwt token
userSchema.methods.getJWTToken=function(){
    return  jwt.sign({id:this._id},process.env.JWT_SECRET)
}

userSchema.methods.comparePassword=async function(getPassword){
    return await bcrypt.compare(getPassword,this.password);
}

userSchema.methods.getResetPasswordToken=function(){
    
    //Generating Token 
    const resetToken=crypto.randomBytes(20).toString("hex");

    //Hashing and add to userSchema 
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now() + 15*60*1000;

    return resetToken;
};

module.exports=mongoose.model("User",userSchema);

// SWETTGHKHJGKULIUKFLLLGLLDKJVFXKJKFDF489T5ZFLKDFFJK