const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

router.post('/login', authController.loginAdmin);

router.post('/logout', authController.logoutAdmin);

router.get('/me', requireAuth, authController.getMe);

module.exports = router;