const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.get('/doc/:id', async (req, res) => {
    try {
        res.json({data: await documents.getOne(req.params.id)});
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

module.exports = router;
