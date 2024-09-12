import 'dotenv/config';

const port = process.env.PORT || 1338; // export PORT=1338 in terminal to set preferred port number

// Import modules
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

// import documents from "./docs.mjs";
import documents from "./new_docs.mjs";

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

// Define routes
app.post('/update', update);
app.get('/new', newRoute);
app.use('/', index); // app.use only works if you have both post and get for some reason
app.get('/:id', id);


// Error handling
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// app.post("/update", async (req, res) => {
//     const result = await documents.update(req.body);

//     return res.redirect(`/${req.body.id}`);
// });

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

app.listen(port, () => {
  console.log(`API backend listening on port ${port}`)
});
