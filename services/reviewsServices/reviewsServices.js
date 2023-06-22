const HttpError = require("../../utils/HttpError");
const { Review } = require("../../models/Reviwes");

const getAllReviewsService = async () => {
  return await Review.find();
};
const getUserReviewService = async (id) => {
  const result = await Contact.findOne({ id });
  if (!result) {
    throw new HttpError(404, `Movie with id=${id} not found`);
  }
  return result;
};
const createReviewService = async (body) => {
  const { _id: owner } = body.user;
  const { text, rating } = body.body;
  return await Review.create({ text, rating, owner });
};
const updateReviewBiIdService = async (body) => {
  const { id } = body.params;
  const result = await Review.findByIdAndUpdate(id, body.body, { new: true });
  if (!result) {
    throw new HttpError(404, `Review with id=${id} not found`);
  }
  return result;
};
const removeReviewService = async (body) => {
  const { id } = body.params;
  const deletedContact = await Review.findByIdAndRemove({ id });
  return deletedContact;
};

module.exports = {
  getAllReviewsService,
  getUserReviewService,
  createReviewService,
  updateReviewBiIdService,
  removeReviewService,
};
