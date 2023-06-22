const HttpError = require("../utils/HttpError")

const validateBody = (schema) => {
    return (req,res,next) => {
        const {error} = schema.validate(req.body);
        if(error){
            next(new HttpError(422, `${error}`));
            return;
        }
        next();
    }
}

module.exports = validateBody;