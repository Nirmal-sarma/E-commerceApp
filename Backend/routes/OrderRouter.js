const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myorders,
  getAllOrders,
  updateOrder,
  deleteOrders,
} = require("../controllers/OrderControllers");

const router = express.Router();
const { isAuthenticated, authorisedRoles } = require("../middleware/Auth");

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/value").get(isAuthenticated, myorders);
router
  .route("/order/adminAllOrders")
  .get(isAuthenticated, authorisedRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorisedRoles("admin"), updateOrder)
  .delete(isAuthenticated, authorisedRoles("admin"), deleteOrders);

router.route("/order/:id").get(isAuthenticated, getSingleOrder);

module.exports = router;
