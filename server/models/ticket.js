const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const TicketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        unique: false,
    },
    uniqueNumber: {
        type: Number,
        required: false,
        trim: true,
        unique: true,
    },
    lastOpenTime: {
        type: Date,
        required: false,
        trim: true,
        unique: false,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: false,
        trim: true,
        unique: false,
        default: 0,
    },
    paid: {
        type: Number,
        required: false,
        trim: true,
        unique: false,
        default: 0,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    }
});

TicketSchema.plugin(uniqueValidator);

// Getter
TicketSchema.path('totalPrice').get(function (num) {
    return (num / 100).toFixed(2);
});

// Setter
TicketSchema.path('totalPrice').set(function (num) {
    return num * 100;
});

module.exports = mongoose.model('Ticket', TicketSchema);