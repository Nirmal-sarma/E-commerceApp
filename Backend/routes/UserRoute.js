const express = require("express");

const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetails,
  UpdatePassword,
  UpdateProfile,
  getAllUser,
  getSingleUserDetail,
  DeleteProfileByAdmin,
  UpdateUserRole,
} = require("../controllers/userControllers");
const { isAuthenticated, authorisedRoles } = require("../middleware/Auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/Password/update").put(isAuthenticated, UpdatePassword);
router.route("/me/update").put(isAuthenticated, UpdateProfile);
router
  .route("/admin/getUser")
  .get(isAuthenticated, authorisedRoles("admin"), getAllUser);

router
  .route("/admin/users/:id")
  .get(isAuthenticated, authorisedRoles("admin"), getSingleUserDetail)
  .put(isAuthenticated, authorisedRoles("admin"), UpdateUserRole)
  .delete(isAuthenticated, authorisedRoles("admin"), DeleteProfileByAdmin);

module.exports = router;
