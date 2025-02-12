const { getSchema } = require("../Models/schema");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const { secretkey } = require("../Config/index");
const async = require('async');
const { studentCollection } = require('../Models/dbschema');

const validationCheck = (req, res, next) => {
    let reqUrl = req.originalUrl;
    let validationSchema = getSchema(reqUrl);
    let validationMethods = Joi.object(validationSchema);
    let result = validationMethods.validate(req.body);
    if (result?.error) {
        res.status(422).send({ status: false, message: result.error.details[0].message });
    } else {
        next()
    }
}

const tokenVerify = (req, res, next) => {
    let id;
    async.waterfall([
        (callback) => {
            let token = req?.headers?.authorization;
            jwt.verify(token, secretkey, (err, result) => {
                if (err) {
                    return res.status(401).send({ status: false, message: "Token Expired" })
                } else {
                    callback(null, result);
                }
            })
        },
        (result, callback) => {
            id = result?.id;
            studentCollection.find({ _id: id }).then((data) => {
                if (data?.length > 0) {
                    callback(null, null);
                } else {
                    res.send({ status: false, message: "Token Expired" })
                }
            });
        }
    ], (err) => {
        if (err) {
            res.status(401).send({ status: false, message: "Token Expired" })
        } else {
            req.headers.id = id;
            next();
        }
    })
}

module.exports = {
    validationCheck,
    tokenVerify
}