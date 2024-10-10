const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.post("/update", 
    (req, res, next) => auth.checkToken(req, res, next),
    async (req, res) => {
    try {
        const result = await documents.update(req.body);

        res.json(result);
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

module.exports = router;
