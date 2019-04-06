const express = require('express');

const Role = require('../models/role');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const roles = await Role.find({});

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all roles',
            roles,
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