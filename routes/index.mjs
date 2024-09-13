import documents from "../docs.mjs";
import express from 'express';

var router = express.Router();

router.get('/', async (req, res) => {
    return res.json({data: await documents.getAll() });
});

router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    console.log(result)
    res.redirect(`/${result.insertedId}`);
});

export default router;
