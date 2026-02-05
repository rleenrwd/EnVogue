const mongoose = require('mongoose');
const Message = require('../models/Message');
const {createMessageSchema} = require('../validators/messageValidator');

exports.createMessage = async (req, res) => {
    const {error, value} = createMessageSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }


    const {name, phone, email, message} = value;

    try {
        const newMessage = await Message.create({
            name,
            phone,
            email,
            message
        });

        return res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

exports.adminGetAllMessages = async (req, res) => {
    console.log('this is coming next');
}