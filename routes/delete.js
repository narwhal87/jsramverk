const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.post("/delete", async (req, res) => {
    try {
        const result = await documents.remove(req.body);

        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.send({"message": "Something went wrong.", "error": e});
    }
});

module.exports = router;
