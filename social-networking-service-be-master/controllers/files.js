const HttpStatus = require('http-status-codes');

exports.uploadFile = (req, res, next) => {
    res.status(HttpStatus.OK).json({ imageUrl: req.file ? req.file.path : '' });
}