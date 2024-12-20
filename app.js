require('dotenv/config');

let port;

if (process.env.NODE_ENV === 'test') {
    port = 1339;
} else {
    port = process.env.PORT || 1338; // export PORT=1338 in terminal to set preferred port number
}

if (process.env.NODE_ENV == 'test') {
    port = 1339;
}
// Import modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const index = require('./routes/index.js');
const id = require('./routes/id.js');
const update = require('./routes/update.js');
const remove = require('./routes/delete.js');
const register = require('./routes/register.js');
const login = require('./routes/login.js');
const share = require('./routes/share.js');

// Import db
const database = require('./db/database.js');

//Test mongoose connection
database.mongoConnection()
mongoose.connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

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
app.get('/doc/:id', id);
app.post('/delete', remove);
app.get('/register', register);
app.post('/register', register);
app.post('/login', login);
app.post('/share', share);
app.get('/share', share);


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

const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

io.on('connection', function(socket) {
    console.log(socket.id);
    console.log("socket connected");
    socket.on('create', function(room) {
        console.log("Created room with id: " + room)
        socket.join(room);
    });
    socket.on('doc', function(data) {
        console.log('Doc with id: ' + data['id'] + " changed.")
        socket.to(data["id"]).emit("doc", data);
    })
});

const server = httpServer.listen(port, () => {
    console.log(`API backend listening on port ${port}`);
});

module.exports = server;
