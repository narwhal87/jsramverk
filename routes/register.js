const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../db/users.js');
const {
    registerValidation,
} = require('../validation.js');

var router = express.Router();

router.post('/register', async (req, res) => {
    
    // Validade input data with Joi
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // New User (mongoose.Schema model)
    var user = new User({
        "username": req.body.username,
        "email": req.body.email,
        "password": hashPassword,
        "salt": salt
    });

    try {
        // If username exists, return 400
        const userConfirmation = await User.findOne({username: req.body.username});
        if (userConfirmation) return res.status(400).send({"message": "User already exists.", "status": 400});

        // If email esists, return 400
        const userConfirmation2 = await User.findOne({email: req.body.email});
        if (userConfirmation2) return res.status(400).send({"message": "E-mail already exists.", "status": 400});

        // Save user to database and return 200 with user data database extract.
        const savedUser = await user.save();
        return res.send({"data": savedUser});

    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
