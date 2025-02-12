const Joi = require("joi");

const userDetailsSchema = {
    fullName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref('password'),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    // cardNumber: Joi.string().creditCard().required(),
    phoneNumber: Joi.string(),
}

const loginSchema = {
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
}

const getUserSchema = {
    id: Joi.string().required()
}

const updateUserSchema = {
    fullName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
}

const deleteUserSchema = {
    id: Joi.string().required()
}

const getSchema = (url) => {
    switch (url) {
        case "/register":
            return userDetailsSchema;
        case "/login":
            return loginSchema;
        case "/getUser":
            return getUserSchema;
        case "/updateUser":
            return updateUserSchema;
        case "/deleteUser":
            return deleteUserSchema;
        default:
            return {}
    }
}


module.exports = {
    getSchema
}

