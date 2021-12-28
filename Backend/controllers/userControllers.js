const User = require("../model/UserModel");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendtoken = require("../Utils/JwtToken");
const SendEmail = require("../Utils/SendEmail");
const crypto = require("crypto");
const Products = require("../model/productModel");
const { is } = require("express/lib/request");

//Register the user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "title is a sample id",
      url: "profilePicUrl",
    },
  });

  sendtoken(user, 201, res);
});

//Login user

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // const token =user.getJWTToken();

  sendtoken(user, 200, res);
});

exports.logout = catchAsyncError((req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "Log Out sucessfully",
    httpOnly: true,
  });
});

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  //getResetPaaword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset token is :- \n\n
    
    ${resetPasswordUrl}\n\n if you have not requested this email then please ignore it`;

  try {
    await SendEmail({
      email: user.email,
      subject: `E-commerce password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} sucessfully`,
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.getResetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password Token is Invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirmPassword must match", 400)
    );
  }

  user.password = req.body.password;
  user.getResetPasswordToken = undefined;
  user.getResetPasswordToken = undefined;
  await user.save();

  sendtoken(user, 200, res);
});

//Get user detail

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
  next();
});

exports.UpdatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.OldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is Incorrect", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendtoken(user, 200, res);

  next();
});

exports.UpdateProfile = catchAsyncError(async (req, res, next) => {
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
  };

  //we will add cloud later

  const user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });

  next();
});

//get all user

exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
  next();
});

//get single user  acess for admin

exports.getSingleUserDetail = catchAsyncError(async (req, res, next) => {
  const users = await User.findById(req.params.id);

  if (!users) {
    return next(
      new ErrorHandler(`User doesnot exists with ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    users,
  });
});

exports.UpdateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserdata, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
  
  next();
});

exports.DeleteProfileByAdmin = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  //Admin will delete cloud

  if (!user) {
    return next(
      new ErrorHandler(`User doesnot exists with ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Sucessfully",
  });
  next();
});


