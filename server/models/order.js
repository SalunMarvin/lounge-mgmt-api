const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        unique: false,
    },
    ready: {
        type: Boolean,
        required: true,
        unique: false,
        default: false,
    },
    created: {
        type: Date,
        required: false,
        trim: true,
        unique: false,
        default: Date.now
    },
    terminal: {
        type: Schema.Types.ObjectId,
        ref: 'Terminal'
    },
});

OrderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', OrderSchema);