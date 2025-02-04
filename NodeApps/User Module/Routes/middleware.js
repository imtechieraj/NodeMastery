const { getSchema } = require("../Models/schema");
const Joi = require("joi");


const validationCheck = (req, res, next) => {
    let reqUrl = req.originalUrl;
    let validationSchema = getSchema(reqUrl);
    let validationMethods = Joi.object(validationSchema);
    let result = validationMethods.validate(req.body);
    if (result?.error) {
        res.status(422).send({status:false, message: result.error.details[0].message});
    } else {
        next()
    }
}

module.exports = {
    validationCheck
}