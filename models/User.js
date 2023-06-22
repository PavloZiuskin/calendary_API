const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const birthdayRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
const Regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // match: Regex,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    avatarURL: String,
    phone: {
      type: Number,
    },
    birthday: {
      type: String,
      match: birthdayRegex,
    },
    skypeNumber: {
      type: Number,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);
schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
const userRegisrtationSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
});
const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
});
const joiVerifyEmailSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(emailRegex))
    .required()
    .messages({ "any.required": "missing required field email" }),
});
const updateUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegex),
  userName: Joi.string(),
  phone: Joi.string(),
  birthday: Joi.string().pattern(birthdayRegex),
  skypeNumber: Joi.number(),
  avatarURL: Joi.string(),
});
const updateUserProfileSchema = Joi.object().keys({
  email: updateUserSchema.extract("email"),
  userName: updateUserSchema.extract("userName"),
  phone: updateUserSchema.extract("phone"),
  birthday: updateUserSchema.extract("birthday"),
  skypeNumber: updateUserSchema.extract("skypeNumber"),
  avatarURL: updateUserSchema.extract("avatarURL"),
});
const schemas = {
  userRegisrtationSchema,
  userLoginSchema,
  joiVerifyEmailSchema,
  updateUserProfileSchema,
};
const User = model("user", schema);

module.exports = { User, schemas };
