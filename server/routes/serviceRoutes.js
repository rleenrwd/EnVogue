const express = require('express');
const router = express.Router();
const service = require('../controllers/serviceController');
const requireAuth = require('../middleware/requireAuth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', service.getServices);

router.get('/:id', service.getServiceById);

router.post('/', [requireAuth, adminOnly], service.createService);

router.put('/:id', [requireAuth, adminOnly], service.updateService);

router.delete('/:id', [requireAuth, adminOnly], service.deleteService);

module.exports = router;