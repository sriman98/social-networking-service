const { body, validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');

exports.followUser = [
    body('userId')
        .trim()
        .notEmpty()
        .withMessage('Followee should not be empty'),

    (req, res, next) => {
        handleValidation(req, res, next)
    }
]

exports.updateUser = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name should not be empty'),

    (req, res, next) => {
        handleValidation(req, res, next)
    }
]

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.errors[0].msg);
        error.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        throw error;
    }
    next();
}