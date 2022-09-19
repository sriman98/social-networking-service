const User = require('../models/user');
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');

const constants = require('../consts/constants');

exports.signup = (req, res, next) => {

    User.findOne({ username: req.body.username })
        .then(existingUser => {
            if (existingUser) {
                const error = new Error('User already exists with username: ' + req.body.username);
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }

            return bcrypt.hash(req.body.password, 12)
        })
        .then(hashedPassword => {
            const user = new User();
            user.username = req.body.username;
            user.password = hashedPassword;
            user.name = req.body.name ? req.body.name : req.body.username;

            return user.save();
        })
        .then(user => {
            const response = {
                _id: user._id,
                username: user.username,
                name: user.name
            }
            res.status(HttpStatus.CREATED).json(response);
        })
        .catch(err => {
            next(err);
        });
}

exports.login = (req, res, next) => {

    let loggedUser = null;

    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                const error = new Error("Invalid Username/Password");
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }

            loggedUser = user;

            return bcrypt.compare(req.body.password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Invalid Username/Password");
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }

            const token = jwt.sign(
                {
                    username: loggedUser.username,
                    userId: loggedUser._id.toString()
                },
                constants.JWT_SECRET_TEXT,
                { expiresIn: constants.JWT_EXPIRATION_DURATION }
            );

            const response = {
                _id: loggedUser._id,
                username: loggedUser.username,
                name: loggedUser.name,
                token: token,
                profileImageUrl: loggedUser.profileImageUrl
            }
            res.status(HttpStatus.OK).json(response);
        })
        .catch(err => {
            next(err);
        });
}

exports.forgotPassword = (req, res, next) => {

    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                const error = new Error("User doesn't exist with username: " + req.body.username);
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }

            const forgotPasswordToken = v4().toString();
            const forgotPasswordTokenExpiration = new Date().getTime() + 1 * 60 * 60 * 1000;

            user.forgotPasswordToken = forgotPasswordToken;
            user.forgotPasswordTokenExpiration = new Date(forgotPasswordTokenExpiration);

            return user.save();
        })
        .then(user => {
            res.status(HttpStatus.OK).json({ passwordResetLink: 'http://localhost:3000/auth/reset-password/' + user.forgotPasswordToken });
        })
        .catch(err => {
            next(err);
        });
}

exports.verifyForgotPasswordLink = (req, res, next) => {

    verifyLink(req.params.forgotPasswordToken)
        .then(user => {
            res.status(HttpStatus.OK).json({ message: 'Valid Token' });
        })
        .catch(err => {
            next(err);
        })
}

exports.resetPassword = (req, res, next) => {

    let existingUser = null;

    verifyLink(req.body.forgotPasswordToken)
        .then(user => {
            existingUser = user;
            return bcrypt.hash(req.body.password, 12);
        })
        .then(hashedPassword => {
            existingUser.password = hashedPassword;
            existingUser.forgotPasswordToken = null;
            existingUser.forgotPasswordTokenExpiration = null;
            return existingUser.save();
        })
        .then(user => {
            const response = {
                _id: user._id,
                username: user.username,
                name: user.name
            }
            res.status(HttpStatus.OK).json(response);
        })
        .catch(err => {
            next(err);
        })
}

const verifyLink = (forgotPasswordToken) => {

    return new Promise((resolve, reject) => {

        User.findOne({ forgotPasswordToken: forgotPasswordToken })
            .then(user => {
                if (!user) {
                    const error = new Error("Invalid token");
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    throw error;
                }

                if (user.forgotPasswordTokenExpiration < new Date()) {
                    const error = new Error("Link expired");
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    throw error;
                }

                return resolve(user);
            })
            .catch(err => {
                return reject(err);
            });
    });
}