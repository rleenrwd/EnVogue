const mongoose = require('mongoose');
const Service = require('../models/Service');
const {createServiceSchema, updateServiceSchema} = require('../validators/serviceValidator');

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
        
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error.",
            });
        
        
    }
}

exports.getServiceById = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid service id.'
        });
    }

    try {
        const service = await Service.findById(id).lean();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.'
            });
        }

        return res.status(200).json({
            success: true,
            data: service
        });

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

exports.createService = async (req, res) => {
    // Validate the request body
    const {error, value} = createServiceSchema.validate(req.body,{
        abortEarly: false, // collects all validation errors (not just the first one)
        stripUnknown: true // removes unexpected fields from input
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid service data.'
        });
    }

    try {
        const createdService = await Service.create(value);

        return res.status(201).json({
            success: true,
            data: createdService
        })
    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        })
    }
}

exports.updateService = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid service id.'
        });
    }

    const {error, value} = updateServiceSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid service data.'
        });
    }

    try {
        const updatedService = await Service.findByIdAndUpdate(
            id,
            value,
            {new: true, runValidators: true}
        );

        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedService
        });
    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
    

 

}

exports.deleteService = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid service id.'
        });
    }

    try {
        const deletedService = await Service.findByIdAndDelete(id);

        if(!deletedService) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.'
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedService
        });
    } catch (err) {
            console.error(err.stack);
            return res.status(500).json({
                success: false,
                message: 'Internal server error.'
            });
        }
    
} 