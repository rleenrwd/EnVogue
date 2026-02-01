const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const adminOnly = require('../middleware/adminOnly');
const requireAuth = require('../middleware/requireAuth');

// Public
router.post('/', bookingController.createBooking);
router.get('/availability', bookingController.getAvailability);


// Admin
router.get('/admin', [requireAuth, adminOnly], bookingController.adminGetBookings);
router.post('/admin', [requireAuth, adminOnly], bookingController.adminCreateBooking);
router.put('/admin/:id', [requireAuth, adminOnly], bookingController.adminUpdateBooking);



module.exports = router;