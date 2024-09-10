import 'dotenv/config';

const port = process.env.PORT || 1338; // export PORT=1338 in terminal to set preferred port number

import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "../docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/${result.lastID}`);
});

app.post("/update", async (req, res) => {
    const result = await documents.update(req.body);

    return res.redirect(`/${req.body.id}`);
});

app.get('/:id', async (req, res) => {
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});

app.get('/new', (res) => {
    return res.render("doc");
});

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

app.listen(port, () => {
  console.log(`API backend listening on port ${port}`)
});
