const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('../models/order.js');
const Product = require('../models/product.js');
const product = require('../models/product.js');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post('/', async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });

        const result = await order.save();

        console.log(result);
        res.status(201).json({
            message: "Order placed",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message || "An error occurred while processing your request"
        });
    }
});


module.exports = router;