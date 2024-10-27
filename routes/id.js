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

        try {
            const result = await documents.getOne(req.params.id);
            
            // console.log("Result", result);
            if ((result[0].viewer && result[0].viewer.includes(currentUser.email)) || userID.id === result[0].ownerID) {
                // console.log("Viewer", result[0].viewer);
                res.json({data: result});
            }

            // res.json({data: result});
        } catch (e) {
            res.status(500);
            res.send({"message": "Something went wrong.", "error": e});
        }
});

module.exports = router;
