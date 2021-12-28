const express = require("express");
const {
  getAllProducts,
  createProducts,
  UpdateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getReviewOfProduct,
  DeleteReview,
} = require("../controllers/productControllers");

const { isAuthenticated, authorisedRoles } = require("../middleware/Auth");
const router = express.Router();

router.route("/products").get(isAuthenticated, getAllProducts);

router
  .route("/admin/products/new")
  .post(isAuthenticated, authorisedRoles("admin"), createProducts);

router
  .route("/admin/products/:id")
  .put(isAuthenticated, authorisedRoles("admin"), UpdateProduct)
  .delete(isAuthenticated, authorisedRoles("admin"), deleteProduct)
  .get(getProductDetail);
  
router.route("/product/:id").get(getAllProducts);
router.route("/review").put(isAuthenticated, createProductReview);

router.route("/reviews/update").get(getReviewOfProduct).delete(isAuthenticated,DeleteReview);

module.exports = router;
