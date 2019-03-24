const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
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
    birthDate: {
        type: Date,
        required: false,
        trim: true,
        unique: false,
    },
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function (next) {
    let user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt
        .genSalt(12)
        .then((salt) => {
            return bcrypt.hash(user.password, salt);
        })
        .then((hash) => {
            user.password = hash;
            next();
        })
        .catch((err) => next(err));
});

module.exports = mongoose.model('User', UserSchema);