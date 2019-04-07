const express = require('express');

const Product = require('../models/product');
const Ticket = require('../models/ticket');
const Cashier = require('../models/cashier');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const products = await Product.find({}).populate('terminal');

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all products',
            products,
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
        const product = await Product.findById(req.params.id);

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got product details',
            product,
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
        const product = new Product(req.body);

        const persistedProduct = await product.save();

        res
            .status(201)
            .json({
                title: 'Product Registration Successful',
                detail: 'Successfully registered new product',
                persistedProduct
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                title: 'Product Registration Error',
                detail: 'Something went wrong during product registration process.',
                errorMessage: err.message,
            }, ],
        });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const {
            name,
            barCode,
            quantity,
            price,
            uniqueCode,
            terminal,
        } = req.body;

        const product = {
            name: name,
            barCode: barCode,
            quantity: quantity,
            price: price,
            uniqueCode: uniqueCode,
            terminal: terminal,
        };

        let persistedProduct = await Product.findByIdAndUpdate(req.params.id, product);

        res
            .status(201)
            .json({
                title: 'Product Registration Successful',
                detail: 'Successfully registered new product',
                persistedProduct
            });
    } catch (err) {
        res.status(400).json({
            errors: [{
                title: 'Product Registration Error',
                detail: 'Something went wrong during product registration process.',
                errorMessage: err.message,
            }, ],
        });
    }
});


router.delete('/:id', authenticate, async (req, res) => {
    try {
        const products = await Product.findByIdAndDelete({ _id: req.params.id});

        res.json({
            title: 'Successful operation',
            detail: 'Successfully delete product',
            products,
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
        const products = await Product.find({ name: { "$regex": name, "$options": "i" } });

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all products',
            products,
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

router.post('/pay', authenticate, async (req, res) => {
    try {
        const { ticketId, cashierId, productsIds } = req.body;
        const ticket = await Ticket.findById(ticketId);
        const cashier = await Cashier.findById(cashierId);

        productsIds.map((productId) => {
            let product = Product.findById(productId);
            let index = ticket.products.indexOf(product._id)
            ticket.products.splice(index, 1);
            ticket.totalPrice -= product.price;
            product.quantity--;
            product.save();
            cashier.products.push(product._id);
            cashier.price += product.price;
        });

        await cashier.save();
        await ticket.save();

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all products',
            ticket,
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

router.post('/remove', authenticate, async (req, res) => {
    try {
        const { ticketId , productsIds } = req.body;
        const ticket = await Ticket.findById(ticketId);

        productsIds.map(async (productId) => {
            let product = await Product.findById(productId);
            let index = ticket.products.indexOf(product._id)
            ticket.products.splice(index, 1);
            product.save();
        });

        await ticket.save();

        res.json({
            title: 'Successful operation',
            detail: 'Successfully got all products',
            ticket,
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