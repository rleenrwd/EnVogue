const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const requireAuth = require('../middleware/requireAuth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', testimonialController.getTestimonials);

// admin
router.get('/admin', [requireAuth, adminOnly], testimonialController.adminGetTestimonials);
router.post('/admin', [requireAuth, adminOnly], testimonialController.adminCreateTestimonial);



module.exports = router;