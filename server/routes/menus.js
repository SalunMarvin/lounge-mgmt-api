const express = require('express');

const Menu = require('../models/menu');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const menus = await Menu.find({});

        res.json({
            title: 'OK',
            detail: 'Menus carregados com sucesso',
            menus,
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