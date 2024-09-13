import documents from "../docs.mjs";
import express from 'express';

var router = express.Router();

router.post("/update", async (req, res) => {
    const result = await documents.update(req.body);

    res.json(result);
});

export default router;
