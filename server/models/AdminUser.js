const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminUserSchema = new Schema({
    email: {type: String, unique: true, required: true, lowercase: true, trim: true},
    passwordHash: {type: String, required: true},
    role: {type: String, default: 'Admin'}

}, 
{
    timestamps: true
}
);

module.exports =  mongoose.model('AdminUser', adminUserSchema);