const express = require('express');

const Order = require('../models/order');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({});

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all orders',
            orders,
        });
    } catch (err) {
        res.status(401).json({
            errors: [{
                title: 'Unauthorized',
                detail: 'Not authorized to access this route',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const order = new Order(req.body);
        const persistedOrder = await order.save();

        res.json({
            title: 'Successful operation',
            detail: 'Successfully created order',
            persistedOrder,
        });
    } catch (err) {
        res.status(401).json({
            errors: [{
                title: 'Unauthorized',
                detail: 'Not authorized to access this route',
                errorMessage: err.message,
            }, ],
        });
    }
});

module.exports = router;