const express = require("express");
const {
  getAllReviews,
  createReview,
  updateReviewBiId,
  removeReview,
  getUserReview,
} = require("../../controllers/reviewsController/reviewsControllers");
const validateBody = require("../../midleware/validationSchema");
const { schemas } = require("../../models/Reviwes");
const authenticate = require("../../midleware/authenticate");

const router = express.Router();
router.use(authenticate);
router.get("/", getAllReviews);
router.get("/:reviewtId", authenticate, getUserReview);
router.post(
  "/",
  authenticate,
  validateBody(schemas.reviewCreateSchema),
  createReview
);
router.delete("/:reviewtId", authenticate, removeReview);
router.patch(
  "/:reviewtId",
  authenticate,
  validateBody(schemas.reviewUpdateSchema),
  updateReviewBiId
);

module.exports = { reviewRoute: router };
