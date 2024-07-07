const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    roles: [{
        type: String,
        default: 'Employee'
    }],
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User', userSchema);