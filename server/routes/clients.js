const express = require('express');

const Client = require('../models/client');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const clients = await Client.find({});

        res.json({
            type: false,
            title: 'OK',
            detail: 'Clientes listados com sucesso!',
            clients,
        });
    } catch (err) {
        res.status(401).json({
            errors: [{
                type: 'error',
                title: 'ERRO',
                detail: 'Erro inesperado. Contate o administrador do sistema.',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const client = new Client(req.body);
        const persistedClient = await client.save();

        res
            .status(201)
            .json({
                type: 'success',
                title: 'OK',
                detail: 'Cliente cadastrado com sucesso!',
                persistedClient
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                type: 'error',
                title: 'ERRO',
                detail: 'Erro inesperado. Contate o administrador do sistema.',
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
            type: false,
            title: 'OK',
            detail: 'Cliente encontrado com sucesso!',
            clients,
        });
    } catch (err) {
        res.status(401).json({
            errors: [{
                type: 'error',
                title: 'ERRO',
                detail: 'Erro inesperado. Contate o administrador do sistema.',
                errorMessage: err.message,
            }, ],
        });
    }
});


module.exports = router;