const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonialSchema = new Schema({
    name: {type: String, minlength: 2, maxlength: 50, trim: true, required: true},
    message: {type: String, minlength:2, maxlength: 500, trim: true, required: true}
}, 
{ timestamps: true});


module.exports = mongoose.model('Testimonial', testimonialSchema);