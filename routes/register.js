const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../db/users.js');
const {
    registerValidation,
} = require('../validation.js');

var router = express.Router();

router.get('/register', async (req, res) => {
    try {
        const test = await auth.registerUser();
        console.log("Abo: ", test);
        res.send({"Abo.": "hehu"});
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

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

    // console.log("Request with: ", req.body, user);

    try {
        // If username exists, return 400
        const userConfirmation = await User.findOne({username: req.body.username});
        if (userConfirmation) return res.status(400).send("User already exists.");

        // Save user to database and return 200 with user data database extract.
        const savedUser = await user.save();
        return res.send(savedUser);

    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
