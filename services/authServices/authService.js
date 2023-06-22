const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { User } = require("../../models/User");
const HttpError = require("../../utils/HttpError");
const sendEmail = require("../../utils/sendMail");
const { SECRET_KEY, BASE_URL } = process.env;

const updateProfileService = async (body) => {
  const updateUser = {};
  const { _id: id } = body.user;
  const { email, userName, birthday, skypeNumber, phone } = body.body;
  const updateAvatarURL = body.file.path;
  const user = await User.findOne({ id });
  if (user.email !== email) {
    await User.findByIdAndUpdate(id, { email });
    updateUser.email = email;
  }
  if (user.userName !== userName) {
    await User.findByIdAndUpdate(id, { userName });
    updateUser.userName = userName;
  }
  if (user.birthday !== birthday) {
    await User.findByIdAndUpdate(id, { birthday });
    updateUser.birthday = birthday;
  }
  if (user.skypeNumber !== skypeNumber) {
    await User.findByIdAndUpdate(id, { skypeNumber });
    updateUser.skypeNumber = skypeNumber;
  }
  if (user.phone !== phone) {
    await User.findByIdAndUpdate(id, { phone });
    updateUser.phone = phone;
  }
  if (user.avatarURL !== updateAvatarURL) {
    await User.findByIdAndUpdate(id, { avatarURL: updateAvatarURL });
    updateUser.avatarURL = updateAvatarURL;
  }
  return updateUser;
};
const registerService = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, "User registered");
  }
  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 12);
  const avatarURL = await gravatar.url(email);
  const result = await User.create({
    ...body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    email,
    subject: "Verify your email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
  const { _id: id } = result;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  result.token = token;
  return result;
};
const loginService = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (!user || !user.verify) {
    throw new HttpError(401, "Email incorrect");
  }
  const passwordCorected = bcrypt.compareSync(password, user.password);
  if (!passwordCorected) {
    throw new HttpError(401, "Password incorrect");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });
  return { user: { userName: user.userName, email: user.email }, token };
};
const resendVerifyEmailService = async (body) => {
  const { email } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, `Email not found`);
  }
  if (user.verify) {
    throw new HttpError(400, `Verification has already been passed`);
  }
  const verifyEmail = {
    email,
    subject: "Verify your email",
    html: `<a href="${BASE_URL}/api/auth/verify/${user.verificationToken}" target="_blank">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
};
const verifyEmailService = async (params) => {
  const { verificationToken } = params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new HttpError(404, `User not found`);
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
};
const logoutService = async (user) => {
  const { _id: id } = user;
  await User.findByIdAndUpdate(id, { token: "" });
};

module.exports = {
  updateProfileService,
  registerService,
  loginService,
  resendVerifyEmailService,
  verifyEmailService,
  logoutService,
};
