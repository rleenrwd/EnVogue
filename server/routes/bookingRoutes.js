const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.get('/availability', bookingController.getAvailability);
router.post('/', bookingController.createBooking);


module.exports = router;