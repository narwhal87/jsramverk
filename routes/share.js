const documents = require("../docs.js");
const express = require('express');
const auth = require('../models/auth.js');

var router = express.Router();

router.post("/share", 
    (req, res, next) => auth.checkToken(req, res, next),
    async (req, res) => {
    try {
        console.log(req.body);
        const result = await documents.share(req.body);
        // const result2 = await documents.update(req.body);
        res.status(200).json(result); // returns nothing
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

module.exports = router;
