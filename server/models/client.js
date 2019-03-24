const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        unique: false,
    },
    uniqueNumber: {
        type: String,
        required: false,
        trim: true,
        unique: true,
    },
    birthDate: {
        type: Date,
        required: false,
        trim: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
});

ClientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Client', ClientSchema);