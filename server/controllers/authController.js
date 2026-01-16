const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRES_IN, cookieOptions} = require('../config/auth');

exports.loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body;

        // checks if there's a falsy value OR only whitespace (empty string, space, etc)
        const isEmpty = (value) => !value || value.trim().length === 0; 

        if (isEmpty(email) || isEmpty(password)) {
            return res.status(400).json({
                success: false,
                message: 'Both email and password are required.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase(); //mathces how email is stored in DB

        const admin = await AdminUser.findOne({email: normalizedEmail});

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            });
        }

        const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'JWT secret not configured. Check .env file.'
            })
        }

        const token = jwt.sign(
            {id: admin._id, role: admin.role},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        );

        res.cookie('token', token, cookieOptions);

        return res.status(200).json({
            success: true,
            data: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
    
}

exports.logoutAdmin = (req, res) => {
    res.clearCookie('token', cookieOptions);

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
    });
}