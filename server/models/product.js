const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        unique: false,
    },
    uniqueCode: {
        type: Number,
        required: false,
        trim: true,
        unique: true,
    },
    barCode: {
        type: String,
        required: false,
        trim: true,
        unique: false,
    },
    quantity: {
        type: Number,
        required: false,
        trim: true,
        unique: false,
    },
    price: {
        type: Number,
        required: false,
        trim: true,
        unique: false,
    },
    terminal: {
        type: Schema.Types.ObjectId,
        ref: 'Terminal',
        required: false,
    },
    cashiers: [{
        type: Schema.Types.ObjectId,
        ref: 'Cashier'
    }],
});

ProductSchema.plugin(uniqueValidator);

// Getter
ProductSchema.path('price').get(function (num) {
    return (num / 100).toFixed(2);
});

// Setter
ProductSchema.path('price').set(function (num) {
    return num * 100;
});

module.exports = mongoose.model('Product', ProductSchema);