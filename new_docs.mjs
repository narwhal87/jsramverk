// import openDb from './db/database.mjs';
import database from "./new_db/database.js";
let collection = "documents";
// const ObjectId = require('mongodb').ObjectId;

const docs = {
    getAll: async function getAll() {
        let db = await database.getDb();

        try {
            // return await db.collection.find({}).toArray();
            let res = await db.collection.find({}).toArray();
            console.log(res)
            return res;
        } catch (e) {
            console.error(e);

            return [];
        } finally {
            await db.client.close();
        }
    },

    // Implement when auto-increment is in place
    getOne: async function getOne(id) {
        let db = await database.getDb();

        try {
            return await db.collection.find(id).toArray();
        } catch (e) {
            console.error(e);

            return {};
        } finally {
            await db.client.close();
        }
    },

    addOne: async function addOne(body) {
        let db = await database.getDb();

        try {
            const doc = {
                title: body.title,
                content: body.content
            };

            return await db.collection.insertOne(doc);
        } catch (e) {
            console.error(e);
        } finally {
            await db.client.close();
        }
    },

    update: async function update(body) {
        let db = await database.getDb();

        try {
            
            const filter = { _id: ObjectId(body["_id"]) };
            const updateDocument = {
            name: body.name,
            html: body.html,
            };

            const result = await db.collection.updateOne(
                filter,
                updateDocument,
            );

        } catch (e) {
            console.error(e)
        } finally {
            await db.client.close();
        }
    }
};

export default docs;
