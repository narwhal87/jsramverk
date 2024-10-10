const documents = require("../docs.js");
const express = require('express');
const auth = require('../models/auth.js');
const jwt = require('jsonwebtoken');
const User = require('../db/users.js');

var router = express.Router();

router.get('/', 
    (req, res, next) => auth.checkToken(req, res, next),
    async (req, res) => {
        const token = req.header('auth-token');
        if (!token) return res.status(400).send("Access denied!");

        const userID = jwt.decode(token, process.env.SECRET_JWT);
        if (!userID) return res.status(400).send("Access denied!");

        const currentUser = await User.findById(userID.id);
        console.log(currentUser);
        if (!currentUser) return res.status(400).send("Access denied!");
        const queryBody = {
            owner: currentUser.username
        };

        try {
            const data = await documents.getAll(queryBody);
            res.status(200);
            return res.json({"data": data });
        } catch (e) {
            res.status(500);
            res.send({"message": "Something went wrong.", "error": e});
        }
});

router.post("/", 
    (req, res, next) => auth.checkToken(req, res, next),
    async (req, res) => {

        const token = req.header('auth-token');
        if (!token) return res.status(400).send("Access denied!");

        const userID = jwt.decode(token, process.env.SECRET_JWT);
        if (!userID) return res.status(400).send("Access denied!");

        const currentUser = await User.findById(userID.id);
        console.log(currentUser);
        if (!currentUser) return res.status(400).send("Access denied!");
        req.body = {
            ...req.body,
            username: currentUser.username,
            userID: userID.id
        }

        console.log(req.body);

        try {
            const result = await documents.addOne(req.body);

            res.status(201);
            res.send(result);
        } catch (e) {
            res.status(500);
            res.send({"message": "Something went wrong.", "error": e});
        }
});

module.exports = router;
