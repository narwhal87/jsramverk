import documents from "../docs.mjs";
import express from 'express';

var router = express.Router();

router.get('/:id', async (req, res) => {
    res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

export default router;
