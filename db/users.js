const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
        // min: 1,
        // max: 30
    },
    email: {
        type: String,
        // required: true,
        // min: 5,
        // max: 255
    },
    password: {
        type: String,
        // required: true,
        // min: 1,
        // max: 255
    },
    salt: {
        type: String,
    }
});

module.exports = mongoose.model("User", userSchema);