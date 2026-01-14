const express = require('express');
const router = express.Router();
const service = require('../controllers/serviceController');

router.get('/', service.getServices);

router.get('/:id', service.getServiceById);

router.post('/', service.createService);

router.put('/:id', service.updateService);

router.delete('/:id', service.deleteService);

module.exports = router;