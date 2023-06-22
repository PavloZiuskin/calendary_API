const express = require("express");
const router = express.Router();
const upload = require("../../midleware/upload");
const {
  register,
  login,
  logout,
  getCurrent,
  updateProfile,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/authController/authControllers");
const authenticate = require("../../midleware/authenticate");
const validateBody = require("../../midleware/validationSchema");
const { schemas } = require("../../models/User");
const handleUserByIdError = require("../../utils/handleUserByIdError");

router.post(
  "/register",
  validateBody(schemas.userRegisrtationSchema),
  register
);
router.post("/login", validateBody(schemas.userLoginSchema), login);
router.get("/current", authenticate, handleUserByIdError, getCurrent);
router.get("/verify/:verificationToken", verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.joiVerifyEmailSchema),
  resendVerifyEmail
);
router.post("/logout", authenticate, handleUserByIdError, logout);
router.patch(
  "/updateprofile",
  authenticate,
  upload.single("avatar"),
  validateBody(schemas.updateUserProfileSchema),
  updateProfile
);

module.exports = { authRoute: router };
