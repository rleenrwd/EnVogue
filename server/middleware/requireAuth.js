const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/auth');

const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message:'Unauthorized.'
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized.'
        });
    }

    req.user = {id: decoded.id, role: decoded.role};
    next();


}

module.exports = requireAuth;