import database from "./db/database.js";
import { ObjectId } from 'mongodb';

const docs = {
    getAll: async function getAll() {
        let db = await database.getDb();

        try {
            let res = await db.collection.find({}).toArray();
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
        if (id.length === 24)
        {
            let query = ObjectId.createFromHexString(id);
            try {
                return await db.collection.find(
                    {'_id': query}
                ).toArray();
            } catch (e) {
                console.error(e);

                return {};
            } finally {
                await db.client.close();
            }
        }
        return {};
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
            let query = ObjectId.createFromHexString(body.id);
            const updateDocument = {
                '$set': {
                }
            };
            // Checks if title or content are undefined to prevent null columns in database
            if (body.title != undefined) {
                updateDocument['$set'].title = body.title;
            }
            if (body.content != undefined) {
                updateDocument['$set'].content = body.content;
            }

            await db.collection.updateOne({'_id':query}, updateDocument);
        
        } catch (e) {
            console.error(e)
        } finally {
            await db.client.close();
        }
    }
};

export default docs;
