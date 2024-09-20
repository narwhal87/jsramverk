process.env.NODE_ENV = 'test';

const {MongoClient} = require("mongodb");
const request = require('supertest');
const app = require("../../app");
let docId = "";

const database = require("../../db/database.js");

describe('Reports', () => {
    let db;

    beforeAll(async () => {
        db = await database.getDb();
    });

    afterAll(async () => {
        db.client.close(); //client?
    });

    it('should just test something', async () => {
        const testBody = {"title": "woohoo"};

        await db.collection.insertOne(testBody);

        const findTest = await db.collection.findOne(testBody);

        expect(findTest).toEqual(testBody);
        await db.collection.deleteOne(testBody);
    });
});

app.close();
