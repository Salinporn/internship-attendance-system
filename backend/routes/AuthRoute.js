const router = require("express").Router();
const {
  Login,
  Logout,
  AdminSignup,
  changePassword,
  forgotPassword,
} = require("../controllers/AuthController");

router.post("/employee-signup", AdminSignup);
// router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.patch("/change-password", changePassword);
router.patch("/forgot-password", forgotPassword);
module.exports = router;
