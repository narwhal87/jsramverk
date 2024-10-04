const Joi = require('joi');

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .min(1),
            // .required(),
        email: Joi.string()
            // .email()
            .min(5),
            // .required(),
        password: Joi.string()
            .min(1)
            // .required()
    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .min(1)
            .required(),
        password: Joi.string()
            .min(1)
            .required()
    })
    return schema.validate(data)
}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation