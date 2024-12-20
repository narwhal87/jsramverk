const documents = require("../docs.js");
const express = require('express');
const auth = require('../models/auth.js');

var router = express.Router();

router.post("/update", 
    (req, res, next) => auth.checkToken(req, res, next),
    async (req, res) => {
    try {
        const result = await documents.update(req.body);
        res.json(result); // returns nothing
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

module.exports = router;
