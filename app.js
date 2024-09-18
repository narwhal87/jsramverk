require('dotenv/config');

let port = process.env.PORT || 1338; // export PORT=1338 in terminal to set preferred port number

if (process.env.NODE_ENV == 'test') {
    port = 1339;
}
// Import modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

// Import routes
const index = require('./routes/index.js');
const id = require('./routes/id.js');
const update = require('./routes/update.js');
const remove = require('./routes/delete.js');


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
app.use('/', index); // app.use only works if you have both post and get for some reason
app.get('/:id', id);
app.post('/delete', remove);


// Error handling
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

const server = app.listen(port, () => {
  console.log(`API backend listening on port ${port}`);
  app.emit('ready');
});

module.exports = server;
