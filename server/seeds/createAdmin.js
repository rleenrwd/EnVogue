if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/AdminUser');

const URI = process.env.MONGO_URI;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPass = process.env.ADMIN_PASSWORD;

if (!URI || !adminEmail || !adminPass) {
    console.error('Missing required env variables. Check .env file.');
    process.exit(1);
} 

const createAdmin = async () => {
    try {
        await mongoose.connect(URI, {
            serverSelectionTimeoutMS:5000
        });

        const normalizedEmail = adminEmail.trim().toLowerCase();
        const existingAdmin = await Admin.findOne({email: normalizedEmail});

        if (existingAdmin) {
            console.log('Admin user already exists. No action taken.');
            return;
        }
        const passwordHash = await bcrypt.hash(adminPass, 12);

        await Admin.create({
            email: normalizedEmail,
            passwordHash,
            role: 'Admin'
        });
        console.log('Successfully created admin user.');
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exitCode = 1;
    } finally {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (_) {}
    }
}

createAdmin();

