/**
 * Connect to the database and setup it with some default data.
 */
"use strict";
const mongo = require("mongodb").MongoClient;
require('dotenv').config();

async function main() {

    let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.8gn6u.mongodb.net/jsramverk?retryWrites=true&w=majority&appName=jsramverk`;
    
    if (process.env.NODE_ENV === 'test') {
        dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.8gn6u.mongodb.net/test?retryWrites=true&w=majority&appName=jsramverk`;
    }
    
    const fs = require("fs"); // File streaming
    const path = require("path");
    const docs = JSON.parse(fs.readFileSync(
        path.resolve(__dirname, "setup.json"),
        "utf8"
    ));
    
    // Do it.
    await resetCollection(dsn, "documents", docs)
        .catch(err => console.log(err));
    return
}


/**
 * Reset a collection by removing existing content and insert a default
 * set of documents.
 *
 * @async
 *
 * @param {string} dsn     DSN to connect to database.
 * @param {string} colName Name of collection.
 * @param {string} doc     Documents to be inserted into collection.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<void>} Void
 */
async function resetCollection(dsn, colName, doc) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);

    await col.deleteMany();
    await col.insertMany(doc);

    await client.close();
}

module.exports = main;
