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
        unique: true,
    },
    quantity: {
        type: Number,
        required: false,
        trim: true,
        unique: false,
    },
    price: {
        type: Schema.Types.Decimal128,
        required: false,
        trim: true,
        unique: false,
    },
});

ProductSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', ProductSchema);