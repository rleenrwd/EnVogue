const Joi = require('joi');

const createTestimonialSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required().messages({
        'any.required': 'Name is required.',
        'string.min': 'Name must be at least 2 characters.',
        'string.max': 'Name must be 50 characters or less.'
    }),
    message: Joi.string().min(10).max(500).trim().required().messages({
        'any.required': 'A testimonial message is required.',
        'string.min': 'A testimonial must be at least 10 characters.',
        'string.max': 'A testimonial must be 500 characters or less.'
    })

});


module.exports = {createTestimonialSchema};

