const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const nodemon = require('nodemon');

// mongoose setup database connection
const db = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PW}@cluster0.jml2mwa.mongodb.net/?retryWrites=true&w=majority;`
mongoose.connect(db, {
    // Set the write concern without the semicolon
    w: 'majority',
    wtimeoutMS: 0,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.log('Error: ', err.message);
});


// logging requests
app.use(morgan('dev'));

// parsing body of incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // * means allow all origins
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // * means allow all origins

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // * means allow all origins
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ // 500 means internal server error
        error: {
            message: error.message
        }
    });
});

module.exports = app;