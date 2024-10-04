require('dotenv').config(); // Give access to process.env variables from .env file
const mongo = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const collectionName = "documents";
const collectionAuth = "users";

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
    },

    getAuthDb: async function getAuthDb() {
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.8gn6u.mongodb.net/jsramverk?retryWrites=true&w=majority&appName=jsramverk`;

        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line max-len
            dsn = `mongodb+srv://Tester:superTest@jsramverk.8gn6u.mongodb.net/test?retryWrites=true&w=majority&appName=jsramverk`;
        }

        const client = await mongo.connect(dsn);
        const db = await client.db();
        const collection = await db.collection(collectionAuth);

        return {
            collection: collection,
            client: client,
        };
    },

    mongoConnection: async function mongoConnection() {
        try {
            await mongoose.connect(process.env.MONGO_CONNECTION_URL); //Mongoose is itself an object, no return

            //Check available collections
            const collections = await (await mongoose.connection.db.listCollections().toArray()).map((coll) => {
                return coll.name
            })

            console.log(collections)

        } catch (err) {
            console.log(err);
        }
    }

};

module.exports = database;
