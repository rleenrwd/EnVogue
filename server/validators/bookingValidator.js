const Joi = require('joi');

const objectId = Joi.string().hex().length(24); // mongoDB ObjectId is 24 hex chars, this matches that.

const createBookingSchema = Joi.object({
    serviceId: objectId.required().messages({
        'any.required': 'Service is required.', 
        'string.length': 'Service must be a valid id.',
        'string.hex': 'Service must be a valid id.',
    }),

    // YYYY-MM-DD (Matches how date is stored in DB)
    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/) 
        .required()
        .messages({
        'any.required': 'Date is required.',
        'string.pattern.base': 'Date must be in YYYY-MM-DD format.',
    }),

    time: Joi.string()
        .pattern(/^\d{2}:\d{2}$/)
        .required()
        .messages({
        'any.required':'Time is required.',
        'string.pattern.base': 'Time must be in HH:mm format.'
    }),

    customerName: Joi.string().min(2).max(80).required().messages({
        'any.required': 'Customer name is required.',
        'string.min': 'Customer name must be at least 2 characters long.',
        'string.max': 'Customer name must be 80 characters or less.'
    }),

    phone: Joi.string().min(10).max(20).required().messages({
        'any.required':'Phone number is required.',
        'string.min': 'Phone number must be at least 10 characters.',
        'string.max': 'Phone number must be 20 characters or less.'
    }),

    email: Joi.string().email().required().messages({
        'any.required':'Email is required.',
        'string.email': 'Email must be a valid email address: example@example.com.'
    }),

    notes: Joi.string().allow('').max(500).messages({
        'string.max': 'Notes must be 500 characters or less.'
    })

});

module.exports = {createBookingSchema};