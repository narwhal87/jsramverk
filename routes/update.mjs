import { ObjectId } from "mongodb";
import documents from "../new_docs.mjs";
import express from 'express';

var router = express.Router();

router.get("/update", async (req, res) => {
    return res.render("doc", {doc: {}});
})

router.post("/update", async (req, res) => {
    const result = await documents.update(req.body);

    res.json(result);
});

export default router;
