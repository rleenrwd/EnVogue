const Service = require('../models/Service');

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({}).lean();

        return res.status(200).json(
            {
                success: true, 
                data: services
            }
        );
    } catch (err) {
        console.error(err.stack);
        
        res.status(500).json(
            {
                success: false,
                message: "Internal server error.",
            });
        
        
    }
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