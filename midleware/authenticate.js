const jwt = require("jsonwebtoken");

const { User } = require("../models/User");

const HttpError = require("../utils/HttpError");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(new HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      return next(new HttpError(401));
    }
    req.user = user;
    next();
  } catch {
    return next(new HttpError(401));
  }
};

module.exports = authenticate;
