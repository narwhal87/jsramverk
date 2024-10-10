const documents = require("../docs.js");
const express = require('express');
const auth = require('../models/auth.js');
const jwt = require('jsonwebtoken');
const User = require('../db/users.js');

var router = express.Router();

router.get('/doc/:id', 
    (req, res, next) => auth.checkToken(req, res, next),
    async (req, res) => {

        const token = req.header('auth-token');
        if (!token) return res.status(400).send("Access denied!");

        const userID = jwt.decode(token, process.env.SECRET_JWT);
        if (!userID) return res.status(400).send("Access denied!");

        const currentUser = await User.findById(userID.id);
        if (!currentUser) return res.status(400).send("Access denied!");
        // req.body = {
        //     ...req.body,
        //     username: currentUser.username,
        //     userID: userID.id
        // }

        console.log("Im in doc id");
        // console.log(req.body);

        try {
            res.json({data: await documents.getOne(req.params.id)});
        } catch (e) {
            res.status(500);
            res.send({"message": "Something went wrong.", "error": e});
        }
});

module.exports = router;
