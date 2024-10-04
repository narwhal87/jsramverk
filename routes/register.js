
const express = require('express');
const auth = require("../auth.js");
const User = require('../db/users.js');
const {
    registerValidation,
    loginValidation
} = require('../validation.js');
const database = require('../db/database.js');

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

router.post('/register', (req, res) => {
    try {

    } catch (e) {
        res.status(500);
        res.send("fuck o");
    }
});

router.post('/registernew', async (req, res) => {
    
    // Validade input data with Joi
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // New User (mongoose.Schema model)
    var user = new User({
        "username": req.body.username,
        "email": req.body.email,
        "password": req.body.password,
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

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = new UserActivation({
        username: req.body.username,
        password: req.body.password,
    });

    try {
        const userConfirmation = await User.findOne({username: req.body.username});

        if (!userConfirmation) return res.status(400).send("User does not exists.");

        res.send("Logged in");

    } catch (e) {
        res.status(400).send(e);
    }

})

module.exports = router;
