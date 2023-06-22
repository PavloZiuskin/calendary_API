const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      max: 1000,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
const reviewCreateSchema = Joi.object({
  rating: Joi.number().required(),
  text: Joi.string().max(1000).required(),
});
const reviewUpdateSchema = Joi.object().keys({
  rating: reviewCreateSchema.extract("rating"),
  text: reviewCreateSchema.extract("text"),
});
const schemas = { reviewCreateSchema, reviewUpdateSchema };
const Review = model("review", schema);

module.exports = { Review, schemas };
