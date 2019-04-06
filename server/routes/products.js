const express = require('express');

const Product = require('../models/product');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const products = await Product.find({});

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


module.exports = router;