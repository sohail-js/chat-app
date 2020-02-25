const mongoose = require('mongoose');

const usersModel = mongoose.model('users', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    registeredOn: {
        type: Date,
        required: true,
        default: Date.now()
    },
    password: {
        type: String,
        required: true
    }
}));


module.exports = usersModel;