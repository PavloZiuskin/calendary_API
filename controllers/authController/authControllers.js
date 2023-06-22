const controllerWrapper = require("../../utils/controllerWrapper");
const {
  updateProfileService,
  registerService,
  loginService,
  resendVerifyEmailService,
  verifyEmailService,
  logoutService,
} = require("../../services/authServices/authService");

const register = controllerWrapper(async (req, res) => {
  const result = await registerService(req.body);
  res.status(201).json({
    userName: result.userName,
    email: result.email,
    token: result.token,
    verificationToken: result.verificationToken,
  });
});
const verifyEmail = controllerWrapper(async (req, res) => {
  await verifyEmailService(req.params);
  res.status(200).json({ message: "Verification successful" });
});
const resendVerifyEmail = controllerWrapper(async (req, res) => {
  await resendVerifyEmailService(req.body);
  res.status(200).json({
    message: "Verification email sent",
  });
});
const login = controllerWrapper(async (req, res) => {
  const result = await loginService(req.body);
  res.json({
    token: result.token,
    user: result.user,
  });
});
const getCurrent = controllerWrapper(async (req, res) => {
  const { email, name } = req.user;
  res.json({
    email,
    name,
  });
});
const logout = controllerWrapper(async (req, res) => {
  await logoutService(req.user);
  res.status(204).json({
    message: "Logout success",
  });
});
const updateProfile = controllerWrapper(async (req, res) => {
  const result = await updateProfileService(req);
  res.status(200).json({ result });
});

module.exports = {
  logout,
  register,
  getCurrent,
  login,
  updateProfile,
  verifyEmail,
  resendVerifyEmail,
};
