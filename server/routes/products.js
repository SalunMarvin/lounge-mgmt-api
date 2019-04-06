const express = require('express');

const Product = require('../models/product');
const {
    authenticate
} = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const {
            name,
            barCode,
            quantity,
            price,
            uniqueCode,
        } = req.body;

        const product = new Product({
            name,
            barCode,
            quantity,
            price,
            uniqueCode,
        });

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