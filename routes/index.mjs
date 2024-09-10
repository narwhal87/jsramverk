import documents from "../docs.mjs";
import express from 'express';

var router = express.Router();

router.get('/', async (req, res) => {
    res.render("index", { docs: await documents.getAll() });
});

router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    res.redirect(`/${result.lastID}`);
});

export default router;
