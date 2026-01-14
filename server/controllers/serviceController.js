const Service = require('../models/Service');

exports.getServices = (req, res) => {
    res.send('All Services');
}

exports.getServiceById = (req, res) => {
    res.send('Here is the service by its ID')
}

exports.createService = (req, res) => {
    res.send('Admin only, service created');
}

exports.updateService = (req, res) => {
    res.send('Admin only, updated service');
}

exports.deleteService = (req, res) => {
    res.send('Admin only, service deleted.');
}