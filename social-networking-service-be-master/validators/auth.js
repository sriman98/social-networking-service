const { body, validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');

exports.signup = [

    body('username')
        .isEmail()
        .withMessage('Email is required')
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password should contain atleast 5 characters'),

    (req, res, next) => {
        handleValidation(req, res, next)
    }
]

exports.login = [

    body('username')
        .isEmail()
        .withMessage('Email is required')
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password should contain atleast 5 characters'),

    (req, res, next) => {
        handleValidation(req, res, next)
    }
];

exports.forgotPassword = [

    body('username')
        .isEmail()
        .withMessage('Email is required')
        .normalizeEmail(),

    (req, res, next) => {
        handleValidation(req, res, next)
    }
];

exports.resetPassword = [

    body('forgotPasswordToken')
        .trim()
        .notEmpty()
        .withMessage('Token is required'),

    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password should contain atleast 5 characters'),

    (req, res, next) => {
        handleValidation(req, res, next)
    }
];

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.errors[0].msg);
        error.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        throw error;
    }
    next();
}
