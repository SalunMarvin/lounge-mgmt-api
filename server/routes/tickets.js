const express = require('express');
const Ticket = require('../models/ticket');
const Product = require('../models/product');
const {
    authenticate
} = require('../middleware/authenticate');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const ticket = new Ticket(req.body);

        const persistedTicket = await ticket.save();

        res
            .status(201)
            .json({
                title: 'Mesa/Cliente adicionado com sucesso',
                detail: 'Adicione novos produtos à comanda',
                persistedTicket
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                title: 'Erro',
                detail: 'Não foi possível adicionar uma nova mesa ou cliente.',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.post('/product', authenticate, async (req, res) => {
    try {
        const {
            criteria,
            ticketId,
            isUniqueCode,
        } = req.body;
        
        let ticket = await Ticket.findById({ _id: ticketId });
        let product = null;

        if (!isUniqueCode) {
            product = await Product.findOne({ _id: criteria });
        }
        
        if (isUniqueCode) {
            if (isUniqueCode.length > 4) {
                product = await Product.findOne({ barCode: criteria });    
            } else {
                product = await Product.findOne({ uniqueCode: criteria });
            }
        }

        ticket.products.push(product);
        const persistedTicket = await ticket.save();

        res
            .status(201)
            .json({
                title: 'OK',
                detail: 'Produto adicionado com sucesso',
                persistedTicket
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                title: 'Erro',
                detail: 'Não foi possível adicionar um novo produto',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const tickets = await Ticket.find({});

        res.json({
            title: 'OK',
            detail: 'Aqui estão suas comandas!',
            tickets,
        });
    } catch (err) {
        res.status(401).json({
            errors: [{
                title: 'Erro',
                detail: 'Não foi possível listar as comandas',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.get('/:uniqueNumber', authenticate, async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ uniqueNumber: req.params.uniqueNumber}).populate('products');

        res.json({
            title: 'OK',
            detail: 'Aqui está sua comanda!',
            ticket,
        });
    } catch (err) {
        res.status(401).json({
            errors: [{
                title: 'Erro',
                detail: 'Não foi possível listar as comandas',
                errorMessage: err.message,
            }, ],
        });
    }
});


module.exports = router;