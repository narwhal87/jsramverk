import express from 'express';

var router = express.Router();

router.get('/new', (req, res) => {
    return res.render("doc", {doc: {}});
});

export default router;
