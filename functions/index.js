const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({origin: true});
process.env.TZ = 'Asia/Bangkok';

const homeRouter = require('./routers/home.js');
const postRouter = require('./routers/posts.js');

const app = express();

// set up app
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(cors);

// use routers
app.use('/', homeRouter);
app.use('/post', postRouter);

// export app as a function
exports.app = functions.https.onRequest(app);