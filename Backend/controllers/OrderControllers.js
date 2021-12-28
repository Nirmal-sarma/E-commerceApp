const Order = require("../model/OrderModel");

const Product = require("../model/productModel");

const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHander = require("../Utils/ErrorHandler");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    date: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this id", 404));
  }

  res.status(200).json({
    succeed: true,
    order,
  });
  next();
});
//get My Orders

exports.myorders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    order: order,
  });
});

//getAll orders for admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;
  order.forEach(ele => 
  totalAmount += ele.totalPrice
)
  res.status(200).json({
    success: true,
    order,
    totalAmount,
  });
 
});

//get Update order for admin

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  console.log(order);

  if(!order){
    return next(new ErrorHander("Order is not found with this id",404))
  }
  
  if(order.orderStatus === 'Delivered'){
    return next(new ErrorHander("Order is already delivered", 404));
    
  }

  order.orderItems.forEach(async (ele) =>{
    await UpdateStock(ele.product,ele.quantity)  
  } )

  order.orderStatus =req.body.status;
  if(order.orderStatus === 'Delivered'){
    order.deliveredAt = Date.now();
}

await order.save({ validateBeforeSave:false });

res.status(200).json({
    success: true,
    
  });
 
});

//Delete order for admin
exports.deleteOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

 if(!order){
   return next(new ErrorHander("Order is not found with this id",404))
 }
 await order.remove();


 res.status(200).json({
    success: true,
 });
 
 });



async function UpdateStock(id,quantity){

const product=await Product.findById(id);

product.Stock-=quantity
await product.save({validateBeforeSave : false});
}