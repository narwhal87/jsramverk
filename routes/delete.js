const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.post("/delete", async (req, res) => {
    const result = await documents.remove(req.body);
    res.status(410);
    res.json(result);
});

module.exports = router;
