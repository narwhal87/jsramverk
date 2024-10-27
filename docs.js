const database = require('./db/database.js');
const { ObjectId } = require('mongodb');
const mailgun = require('./models/mailgun.js');
const { query } = require('express');
const { db } = require('./db/users.js');

const docs = {
    getAll: async function getAll(queryBody) {

        console.log("getAll with queryBody ", queryBody);

        let db = await database.getDb();
        let res = [];

        queryBody = {
            ...queryBody,
            // viewer: "alfpn87@gmail.com"
        }

        try {
            if (queryBody.owner) {
                res = await db.collection.find({owner: queryBody.owner}).toArray();    
            }
            if (queryBody.viewer) {
                res = res.concat(await db.collection.find({viewer: queryBody.viewer}).toArray());    
            }

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

        if (id.length === 24) {
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
                content: body.content,
                owner: body.username,
                ownerID: body.userID,
                viewer: body.email
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
            if (body.viewer != undefined) {
                updateDocument['$set'].viewer = body.viewer;
            }

            await db.collection.updateOne({'_id': query}, updateDocument);
        } catch (e) {
            console.error(e);
        } finally {
            await db.client.close();
        }
    },

    remove: async function remove(body) {
        let db = await database.getDb();

        try {
            let query = ObjectId.createFromHexString(body.id);

            await db.collection.deleteOne({'_id': query});
        } catch (e) {
            console.error(e);
        } finally {
            await db.client.close();
        }
    },

    share: async function share(body) {
        let db = await database.getDb();

        try {
            // Send e-mail with Mailgun
            mailgun.mgShare(body.email);

            // Get document
            const document = await this.getOne(body.id);
            console.log("document: ", document);

            // Set or update document viewer property
            if (!document[0].viewer) {
                document[0].viewer = [body.email];
            } else if (typeof(document[0].viewer) === "object" && !document[0].viewer.includes(body.email)) {
                document[0].viewer.push(body.email);
            }

            // Push viewer update to database
            body = {
                ...body,
                viewer: document[0].viewer
            }

            console.log("Update document with new body", body);
            
            const res = await this.update(body);

        } catch (e) {
            console.error(e);
        } finally {
            await db.client.close();
        }
    },

    checkEmailExists: async function checkEmailExists(document, email) {
        try {
            return document.includes(email);
        } catch (e) {
            console.error(e);
        }
    }
};

module.exports = docs;
