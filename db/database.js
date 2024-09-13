const mongo = require("mongodb").MongoClient;
const collectionName = "documents";

const database = {
    getDb: async function getDb () {
        let dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/jsramverk";

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://mongodb:27017/jsramverk";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
