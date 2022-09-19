const { body, validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');

exports.addComment = [

    body('comment')
        .trim()
        .notEmpty()
        .withMessage('Comment should not be empty'),

    body('postId')
        .trim()
        .notEmpty()
        .withMessage('Post Id should not be empty'),

    (req, res, next) => {
        handleValidation(req, res, next)
    }
]

exports.updateComment = [

    body('comment')
        .trim()
        .notEmpty()
        .withMessage('Comment should not be empty'),

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