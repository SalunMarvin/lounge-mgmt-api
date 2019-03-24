const express = require('express');

const Client = require('../models/client');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const client = new Client(req.body);
        const persistedClient = await client.save();

        res
            .status(201)
            .json({
                title: 'Client Registration Successful',
                detail: 'Successfully registered new client',
                persistedClient
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                title: 'Client Registration Error',
                detail: 'Something went wrong during client registration process.',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const clients = await Client.find({});

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all clients',
            clients,
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

router.post('/search', authenticate, async (req, res) => {
    try {
        const { name } = req.body;
        const clients = await Client.find({ name: { "$regex": name, "$options": "i" } });

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all clients',
            clients,
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