const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await documents.getAll();

        res.status(200);
        return res.json({"data": data });
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

router.post("/", async (req, res) => {
    try {
        const result = await documents.addOne(req.body);

        res.status(201);
        res.send(result.insertedId);
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

module.exports = router;
