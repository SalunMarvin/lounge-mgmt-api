const express = require('express');

const Cashier = require('../models/cashier');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const cashiers = await Cashier.find({});

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all cashiers',
            cashiers,
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

router.get('/:id', authenticate, async (req, res) => {
    try {
        const cashier = await Cashier.findById(req.params.id);

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got cashier',
            cashier,
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
        const cashier = new Cashier(req.body);
        const persistedCashier = await cashier.save();

        res.json({
            title: 'Successful operation',
            detail: 'Successfully saved cashier',
            persistedCashier,
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