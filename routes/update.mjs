import documents from "../docs.mjs";
import express from 'express';

var router = express.Router();

router.post("/update", async (req, res) => {
    const result = await documents.update(req.body);

    res.redirect(`/${req.body.id}`);
});

export default router;
