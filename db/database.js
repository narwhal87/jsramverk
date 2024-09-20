require('dotenv').config();
const mongo = require("mongodb").MongoClient;
const collectionName = "documents";

const database = {
    getDb: async function getDb() {
        // eslint-disable-next-line max-len
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.8gn6u.mongodb.net/jsramverk?retryWrites=true&w=majority&appName=jsramverk`;
        //let dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/jsramverk";


        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line max-len
            dsn = `mongodb+srv://Tester:superTest@jsramverk.8gn6u.mongodb.net/test?retryWrites=true&w=majority&appName=jsramverk`;
        }

        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
