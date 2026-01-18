const adminOnly = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden.'
        });
    } 
    next();
}

module.exports = adminOnly;