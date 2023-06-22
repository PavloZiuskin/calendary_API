const HttpError = require("../utils/HttpError");

const {User} = require("../models/User");

const handleUserByIdError = async (req, res, next) => {
  const { _id: id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      next(new HttpError(401, "Not authorized")) ;
    }
  } catch  {
    next(new HttpError(401, "Not authorized"));
  }
  
};

module.exports = handleUserByIdError;
