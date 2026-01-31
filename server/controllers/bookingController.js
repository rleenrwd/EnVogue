const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const {createBookingSchema, availabilityQuerySchema} = require('../validators/bookingValidator');
const {sendBookingConfirmationSms} = require('../services/smsService');
const {buildBookingConfirmationSms} = require('../utils/smsTemplates');
const {parseTimeToMinutes, minutesToTime, generateAvailStartTimes} = require('../utils/time');

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
            notes,
            status: 'Confirmed'
        });
        
        const smsConfirmation = buildBookingConfirmationSms({
            customerName,
            serviceName: service.name,
            date,
            time
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('SMS payload about to be sent:', {to: phone, body: smsConfirmation});
        }
        

        try {
            await sendBookingConfirmationSms({to: phone, body: smsConfirmation});

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

exports.getAvailability = async (req, res) => {

    const {error, value} = availabilityQuerySchema.validate(req.query, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const {date, serviceId} = value;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({
            success: false,
            message: 'Service Id must be a valid ObjectId.'
        });
    }

    try {
        const service = await Service.findById(serviceId).lean();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.'
            });
        }

        const serviceDurationBlockMins = service.durationMins + 10;

        const STORE_OPEN_MIN = 9 * 60;
        const STORE_CLOSE_MIN = 18 * 60;

        // This makes it so our front end can display 'no available time slots'
        if (STORE_OPEN_MIN + serviceDurationBlockMins > STORE_CLOSE_MIN) {
            return res.status(200).json({
                success: true,
                data: {
                    date,
                    serviceId,
                    availTimes: [],
                },
            });
        }

        const bookings = await Booking.find({
            date,
            status: {$ne: 'Cancelled'}, //$ne = not equal to
        }).populate('serviceId', 'durationMins').lean();

        const occupiedIntervals = [];
        
        for (const booking of bookings) {
            const startMin = parseTimeToMinutes(booking.time);
            if (startMin === null) continue;

            const bookingBlockMins = booking.serviceId?.durationMins ? booking.serviceId.durationMins + 10 : 100;

            occupiedIntervals.push({
                start: startMin,
                end: startMin + bookingBlockMins,
            });
        }
        const availStartTimes = generateAvailStartTimes({
            storeOpenMin: STORE_OPEN_MIN,
            storeCloseMin: STORE_CLOSE_MIN,
            serviceDurationBlockMins,
            stepMinutes: 10,
        });

        const availTimes = [];

        for (const start of availStartTimes) {
            const end = start + serviceDurationBlockMins;

            const overlaps = occupiedIntervals.some((overlap) => start < overlap.end && end > overlap.start);
            if (!overlaps) {
                availTimes.push(minutesToTime(start));
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                date,
                serviceId,
                availTimes
            },
        });

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }

}

exports.getBookings = async (req, res) => {

    try {
        const bookings = await Booking.find()
        .populate('serviceId', 'name durationMins') // Gets related service doc (with the serviceId), with just the name and durationMins field
        .sort({date: 1, time: 1})
        .lean();

        return res.status(200).json({
            success: true,
            data: bookings,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        });
    }
}

exports.adminCreateBooking = async (req, res) => {
    const {error, value} = createBookingSchema.validate(req.body,{
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    try {
        const {serviceId, date, time, customerName, phone, email, notes} = value;

        const service = await Service.findById(serviceId).lean();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.'
            });
        }

        const booking = await Booking.create({
            serviceId,
            date,
            time,
            customerName,
            phone,
            email,
            notes,
            status: 'Confirmed'
        });

        const smsConfirmation = buildBookingConfirmationSms({
            customerName,
            serviceName: service.name,
            date,
            time
        });

        
        if (process.env.NODE_ENV !== 'production') {
            console.log('SMS payload about to be sent:', {to: phone, body: smsConfirmation});
        }

        try {
            await sendBookingConfirmationSms({to: phone, body: smsConfirmation});

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
    } catch (err) {
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