const documents = require("../docs.js");
const express = require('express');

var router = express.Router();

router.get('/doc/:id', async (req, res) => {
    res.json({data: await documents.getOne(req.params.id)});
});

module.exports = router;
