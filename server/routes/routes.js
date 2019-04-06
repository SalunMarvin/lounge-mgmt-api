const express = require('express');

const Route = require('../models/route');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const routes = await Route.find({});

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all routes',
            routes,
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