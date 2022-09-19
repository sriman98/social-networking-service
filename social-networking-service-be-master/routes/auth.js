const express = require('express');
const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');

const router = express.Router();

router.post('/signup', authValidator.signup, authController.signup);

router.post('/login', authValidator.login, authController.login);

router.post('/forgot-password', authValidator.forgotPassword, authController.forgotPassword);

router.get('/reset-password/:forgotPasswordToken', authController.verifyForgotPasswordLink);

router.post('/reset-password', authValidator.resetPassword, authController.resetPassword);

module.exports = router;