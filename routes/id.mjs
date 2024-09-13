import documents from "../docs.mjs";
import express from 'express';

var router = express.Router();

router.get('/:id', async (req, res) => {
    res.json({data: await documents.getOne(req.params.id)});
});

export default router;
