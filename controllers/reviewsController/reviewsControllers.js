const {
  getAllReviewsService,
  getUserReviewService,
  createReviewService,
  updateReviewBiIdService,
  removeReviewService,
} = require("../../services/reviewsServices/reviewsServices");
const controllerWrapper = require("../../utils/controllerWrapper");

const getAllReviews = controllerWrapper(async (req, res) => {
  const result = await getAllReviewsService();
  res.status(201).json({ result });
});
const getUserReview = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const contacts = await getContactByIdService(id);
  res.status(200).json(contacts);
});
const createReview = controllerWrapper(async (req, res) => {
  const result = await createReviewService(req);
  res.status(201).json({ result });
});
const updateReviewBiId = controllerWrapper(async (req, res) => {
  const result = await updateReviewBiIdService(req);
  res.status(201).json({ result });
});
const removeReview = controllerWrapper(async (req, res) => {
  const removeReview = await removeReviewService(req);
  res.status(204).json({ removeReview });
});
module.exports = {
  getAllReviews,
  createReview,
  getUserReview,
  updateReviewBiId,
  removeReview,
};
