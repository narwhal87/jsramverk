process.env.NODE_ENV = 'test';


const request = require('supertest');
const app = require("../../app");
let docId = "";

describe('Reports', () => {
    describe('GET /', () => {
        it('Should return all documents', async () => {
            return request(app)
                .get("/")
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });
    describe('POST /', () => {
        it('Should create a document', async () => {
            return request(app)
            .post("/")
            .send({"title": "test", "content": "test new content"})
            .expect(201)
            .then(({ body }) => {
                docId = body;
            });
        });
    });
    // Should be part of a teardown
    describe('POST /delete', () => {
        it('Should delete a document', async () => {
            return request(app)
            .post('/delete')
            .send({"id": docId})
            .expect(410);
        })
    })
});

app.close();
