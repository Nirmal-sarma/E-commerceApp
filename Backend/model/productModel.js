
const mongoose = require("mongoose");

const ProductSchema =new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Product Name"],
  },

  description: {
    type: String,
    required: [true, "Please enter the product description"],
  },
  price: {
    type: Number,
    require: [true, "Please enter the price"],
    maxLength: [8, "Price cannot exceed 8 figure"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image: [
    {
      public_Id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter the Product Category"],
  },
  Stock: {
    type: Number,
    require: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed  4 character"],
  },
  numberofReview:{
      type:Number,
      default:0,
  },
  reviews:[
    {
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,
      },
       name:{
           type:String,
           required:true
       },
       rating:{
           type:Number,
           required:true
       },
       Comment:{
           type:String,
           required:true,
       }
    }
  ],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"user",
    required:true,
  },
  createAt:{
      type: Date,
      default:Date.now
  }
});

module.exports=mongoose.model("Product",ProductSchema);