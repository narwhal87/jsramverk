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
    // Should be part of a set up
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
    describe('POST /update', () => {
        it('Should update a document', async () => {
            return request(app)
            .post("/update")
            .send({"title": "Updated title", "content": "Updated content", 'id': docId})
            .expect(200)
        })
    });

    describe('GET /:id', () => {
        it('Should get a specific document', async () => {
            return request(app)
            .get('/:' + docId)
            .expect(200)
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
