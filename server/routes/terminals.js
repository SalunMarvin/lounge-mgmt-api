const express = require('express');

const Terminal = require('../models/terminal');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const terminals = await Terminal.find({});

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all terminals',
            terminals,
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
        const terminal = await Terminal.findById(req.params.id);

        res.json({
            title: 'OK',
            detail: 'Terminal encontrado com sucesso',
            terminal,
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