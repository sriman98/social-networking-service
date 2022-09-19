const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const hashtagRoutes = require('./routes/hashtag');
const filesRoutes = require('./routes/files');
const notificationRoutes = require('./routes/notification');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use(userRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(hashtagRoutes);
app.use(filesRoutes);
app.use(notificationRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message;
    res.status(status).json({ status: status, message: message, timeStamp: new Date() });
});

mongoose.set('debug', true);

mongoose.connect('mongodb+srv://saianirud:saianirud@mycluster-p0gsl.mongodb.net/social_media_app?retryWrites=true&w=majority')
    .then(res => {
        console.log('Connected to database...');
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });