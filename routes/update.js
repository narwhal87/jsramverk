const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.post("/update", async (req, res) => {
    const result = await documents.update(req.body);

    res.json(result);
});

module.exports = router;
