const express = require('express');
const Ticket = require('../models/ticket');
const Product = require('../models/product');
const Client = require('../models/client');
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
            isUniqueNumber,
        } = req.body;
        
        let ticket = await Ticket.findById({ _id: ticketId });
        let product = null;

        if (!isUniqueNumber) {
            product = await Product.findOne({ _id: criteria });
        }
        
        if (isUniqueNumber) {
            if (isUniqueNumber.length > 4) {
                product = await Product.findOne({ barCode: criteria });    
            } else {
                product = await Product.findOne({ uniqueCode: criteria });
            }
        }

        ticket.totalPrice = ticket.totalPrice + product.price;
        ticket.products.push(product);
        let persistedTicket = await ticket.save();
        persistedTicket = await Ticket.findOne({ _id: persistedTicket._id }).populate('products')

        let products = []
        persistedTicket.products.map(product => {
            if (!products.some(item => item._id === product._id)) {
                let newProduct = product;
                product.quantity = 1;
                products.push(newProduct)
            } else {
                let arrayProduct = products.find(criteria => criteria._id === product._id)
                let newProduct = {
                    _id: arrayProduct._id,
                    name: arrayProduct.name,
                    barCode: arrayProduct.barCode,
                    quantity: arrayProduct.quantity + 1,
                    price: arrayProduct.price + product.price,
                    uniqueCode: arrayProduct.uniqueCode,
                }

                let newArray = [arrayProduct];
                products = products.filter(item => !newArray.includes(item))

                products.push(newProduct);
            }
        })
        persistedTicket.products = products

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

router.post('/client', authenticate, async (req, res) => {
    try {
        const {
            criteria,
            ticketId,
        } = req.body;
        
        let ticket = await Ticket.findById({ _id: ticketId });
        let client = await Client.findOne({ _id: criteria });

        ticket.client = client;
        ticket.name = client.name;
         
        let persistedTicket = await ticket.save();
        persistedTicket = await Ticket.findOne({ _id: persistedTicket._id }).populate('client')

        res
            .status(201)
            .json({
                title: 'OK',
                detail: 'Cliente adicionado com sucesso',
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                title: 'Erro',
                detail: 'Não foi possível adicionar um novo cliente',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.delete('/product', authenticate, async (req, res) => {
    try {
        const {
            productId,
            ticketId,
        } = req.body;
        
        let ticket = await Ticket.findById({ _id: ticketId });
        let product = await Product.findOne({ _id: productId });

        ticket.totalPrice = ticket.totalPrice - product.price;
        let index = ticket.products.findIndex(criteria => criteria = product._id)
        ticket.products.splice(index, 1)
        let persistedTicket = await ticket.save();
        persistedTicket = await Ticket.findOne({ _id: persistedTicket._id }).populate('products')

        let products = []
        persistedTicket.products.map(product => {
            if (!products.some(item => item._id === product._id)) {
                let newProduct = product;
                product.quantity = 1;
                products.push(newProduct)
            } else {
                let arrayProduct = products.find(criteria => criteria._id === product._id)
                let newProduct = {
                    _id: arrayProduct._id,
                    name: arrayProduct.name,
                    barCode: arrayProduct.barCode,
                    quantity: arrayProduct.quantity + 1,
                    price: arrayProduct.price + arrayProduct.price,
                    uniqueCode: arrayProduct.uniqueCode,
                }

                let newArray = [arrayProduct];
                products = products.filter(item => !newArray.includes(item))

                products.push(newProduct);
            }
        })
        persistedTicket.products = products

        res
            .status(201)
            .json({
                title: 'OK',
                detail: 'Produto removido com sucesso',
                persistedTicket
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                title: 'Erro',
                detail: 'Não foi possível remover um novo produto',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const tickets = await Ticket.find({}).sort({ 'uniqueNumber': 1 }).populate('products').populate('client');

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
        let ticket = await Ticket.findOne({ uniqueNumber: req.params.uniqueNumber }).populate('products').populate('client');
        
        let products = []
        ticket.products.map(product => {
            if (!products.some(item => item._id === product._id)) {
                let newProduct = product;
                product.quantity = 1;
                products.push(newProduct)
            } else {
                let arrayProduct = products.find(criteria => criteria._id === product._id)
                let newProduct = {
                    _id: arrayProduct._id,
                    name: arrayProduct.name,
                    barCode: arrayProduct.barCode,
                    quantity: arrayProduct.quantity + 1,
                    price: arrayProduct.price + product.price,
                    uniqueCode: arrayProduct.uniqueCode,
                }

                let newArray = [arrayProduct];
                products = products.filter(item => !newArray.includes(item))

                products.push(newProduct);
            }
        })
        ticket.products = products

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