const Joi = require('joi');

const createMessageSchema = Joi.object({
    name: Joi.string().min(2).max(80).trim().required().messages({
        'any.required': 'Name is required.',
        'string.min': 'Name must be at least 2 characters.',
        'string.max': 'Name must be 80 characters or less.'
    }),
    phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9()\-\s]+$/) // allows optional + at start and one of each char in the bracket only
    .custom((value, helpers) => {
        const digitsOnly = value.replace(/\D/g, ''); //replaces all occurences of non-digit chars
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
            return helpers.error('string.phoneDigits');
        }
        return value;
    })
    .required()
    .messages({
        'any.required':'Phone number is required.',
        'string.pattern.base': 'Phone number contains invalid characters.',
        'string.phoneDigits': 'Phone number must contain between 10 and 15 digits.'
    }),
    email: Joi.string().email().trim().required().messages({
        'any.required': 'Email is required.',
        'string.email': 'Email must be a valid email address: example@example.com.'
    }),
    message: Joi.string().min(10).max(500).trim().required().messages({
        'any.required': 'Message is required.',
        'string.min': 'Message must be at least 10 characters.',
        'string.max': 'Message must be 500 characters or less.'
    }),
});


module.exports = {createMessageSchema};