const express = require('express');

const Cashier = require('../models/cashier');
const Session = require('../models/session');
const User = require('../models/user');
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
        const session = await Session.findOne({ token: req.headers.token });
        const userId = session.userId;
        const user = await User.findById(userId);
        cashier.name = user.name;
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

router.post('/close/:id', authenticate, async (req, res) => {
    try {
        const cashier = await Cashier.findById(req.params.id);
        cashier.closeDate = Date.now();

        const persistedCashier = await cashier.save();

        res.json({
            title: 'OK',
            detail: 'Caixa fechado com sucesso',
            persistedCashier,
        });
    } catch (err) {
        res.status(401).json({
            errors: [{
                title: 'Erro',
                detail: 'Erro',
                errorMessage: err.message,
            }, ],
        });
    }
});

module.exports = router;