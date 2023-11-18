const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({ // 200 means OK
        message: 'Orders were fetched'
    })
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }

    res.status(200).json({ // 200 means OK
        message: 'Orders created',
        order: order
    })
});

module.exports = router;