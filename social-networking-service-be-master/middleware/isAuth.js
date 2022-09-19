const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const constants = require('../consts/constants');

module.exports = (req, res, next) => {

    const tokenHeader = req.get('Authorization');

    if (!tokenHeader) {
        const error = new Error('Session expired! Please login again');
        error.statusCode = HttpStatus.UNAUTHORIZED;
        throw error;
    }

    const token = tokenHeader.split(' ')[1];

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, constants.JWT_SECRET_TEXT);
    } catch (err) {
        const error = new Error('Session expired! Please login again');
        error.statusCode = HttpStatus.UNAUTHORIZED;
        throw error;
    }

    if (!decodedToken) {
        const error = new Error('Session expired! Please login again');
        error.statusCode = HttpStatus.UNAUTHORIZED;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}