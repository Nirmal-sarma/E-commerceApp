const catchAsyncError = require("../middleware/catchAsyncError");
const { find } = require("../model/productModel");
const Products = require("../model/productModel");
const ApiFeature = require("../Utils/Apifeature");
const ErrorHandler = require("../Utils/ErrorHandler");

// For admin Only
const createProducts = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Products.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

//get all product by using filtering ,search ,pageSize

const getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 3;
  const productCount = await Products.countDocuments();
  const apifeature = new ApiFeature(Products.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const product = await apifeature.query;
  res.status(200).json({
    success: true,
    product,
  });
});

//getProductDetail by id
const getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product deleted", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

const UpdateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Products.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
    });
  }

  product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

const deleteProduct = catchAsyncError(async (req, res) => {
  let product = await Products.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      sucess: false,
      message: "product not found",
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    dataDeleted: "The product Deleted Successfully",
  });
});

const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, Comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    Comment: Comment,
  };

  const product = await Products.findById(productId);

  const isReview = product.reviews.find(
    (ele) => ele.user.toString() === req.user.id
  );
  console.log(isReview);
  if (isReview) {
    product.reviews.forEach((ele) => {
      if (ele.user.toString() === req.user.id) {
        (ele.rating = rating), (ele.Comment = Comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numberofReview = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((ele) => {
    avg += ele.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// get all review of single product
const getReviewOfProduct = catchAsyncError(async (req, res, next) => {

  const product = await Products.findById(req.query.id);
  if (!product) {
    return res.status(500).json({
      sucess: false,
      message: "product not found",
    });
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});


const DeleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Products.findById(req.query.productId);
  console.log(product);
  if (!product) {
    return res.status(500).json({
      sucess: false,
      message: "product not found",
    });
  }

  let reviews=product.reviews.filter(
    ele => ele._id.toString() !== req.query.reviewId.toString()
  );

    

    let avg = 0;
  product.reviews.forEach((ele) => {
    avg += ele.rating;
  });

  const ratings = avg / reviews.length;
  console.log(reviews.length)
  const numberofReview = reviews.length;
 
  await Products.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberofReview,
    },
    { new: true, runValidator: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  getAllProducts,
  createProducts,
  UpdateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getReviewOfProduct,
  DeleteReview
};
