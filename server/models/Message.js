const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name: {type: String, required: true, trim: true},
    phone: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    message: {type: String, required: true, minlength: 10, trim: true },
},
{timestamps: true});



module.exports = mongoose.model('Message', messageSchema);