const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../db/users.js');
const { loginValidation } = require('../validation.js');

var router = express.Router();

router.post('/login', async (req, res) => {

    // Validate input with Joi
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    // console.log(user);

    try {
        const userConfirmation = await User.findOne({username: req.body.username});
        if (!userConfirmation) return res.status(400).send({"message": "User does not exists."});

        const validate = await bcrypt.compare(
            req.body.password,
            userConfirmation.password
        );
        if (!validate) return res.status(400).send({"message": "Invalid password"});

        const token = jwt.sign(
            { 
                id: userConfirmation._id
            },
            process.env.SECRET_JWT
        )

        if (!token) return res.status(500).send({"message": "JWT signature error"});

        return res.header("auth-token", token).send({"token": token, "message": "Login successful"});

    } catch (e) {
        res.status(400).send(e);
    }

})

module.exports = router;
