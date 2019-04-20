const express = require('express');

const Order = require('../models/order');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({'created': 1});

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

router.get('/terminal/:id', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ terminal: req.params.id, ready: false }).sort({'created': 1});

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

router.post('/ready/:id', authenticate, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        order.ready = true;

        const persistedOrder = await order.save();

        var io = req.app.get('socketio');
        io.emit('orderReady', persistedOrder);

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