const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.get('/', async (req, res) => {
    return res.json({data: await documents.getAll() });
});

router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);

    res.status(201);
    res.send(result.insertedId);
});

module.exports = router;
