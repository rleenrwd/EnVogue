const Booking = require('../models/Booking');
const Service = require('../models/Service');
const {createBookingSchema} = require('../validators/bookingValidator');
const {sendSms} = require('../services/smsService');
const {buildBookingConfirmationSms} = require('../utils/smsTemplates');

exports.createBooking = async (req, res) => {
    const {error, value} = createBookingSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }

    try {
        const {serviceId, date, time, customerName, phone, email, notes} = value;

        const service = await Service.findById(serviceId).lean();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.'
            })
        }

        const booking = await Booking.create({
            serviceId,
            date,
            time,
            customerName,
            phone,
            email,
            notes
        });
        
        const smsBody = buildBookingConfirmationSms({
            customerName,
            serviceName: service.name,
            date,
            time
        });

        try {
            await sendSms({to: phone, body: smsBody});

            await Booking.findByIdAndUpdate(booking._id, {
                smsStatus: 'Sent',
                smsError: '',
            });
        } catch (smsErr) {
            console.error('SMS send failed:', smsErr);
            
            await Booking.findByIdAndUpdate(booking._id, {
                smsStatus: 'Failed',
                smsError: smsErr?.message || 'SMS Failed.'
            });
        }

        const updatedBooking = await Booking.findById(booking._id).lean();

        return res.status(201).json({
            success: true,
            data: updatedBooking
        });

    } catch(err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Slot already booked.'
            });
        } 

        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
        
    }
}