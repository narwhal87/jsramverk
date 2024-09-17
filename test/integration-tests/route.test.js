process.env.NODE_ENV = 'test';

describe('Reports', () => {
    let app;
    let request;

    beforeAll(() => {
        request = require('supertest');
        app = require("../../app");
        let docId = "";
    });

    afterAll(() => {
        app.close();
      });

    describe('GET /', () => {
        it('Should return all documents', async () => {
            await request(app)
                .get("/")
                .expect('Content-Type', /json/)
                .expect(200)
                .then( ({ body }) => {
                    expect(body).toHaveProperty("data");
                });                
        });
    });
    // Should be part of a set up
    describe('POST /', () => {
        it('Should create a document', async () => {
            await request(app)
            .post("/")
            .send({"title": "test", "content": "test new content"})
            .expect(201)
            .then(({ body }) => {
                docId = body;
                expect(body).toHaveLength(24);
            });
        });
    });

    describe('POST /update', () => {
        it('Should update a document', async () => {
            await request(app)
            .post("/update")
            .send({"title": "Updated title", "content": "Updated content", 'id': docId})
            .expect(200);
            const response = await request(app)
            .get('/' + docId)
            expect(JSON.parse(response.text).data[0]).toMatchObject({'_id': docId, "title": "Updated title", "content": "Updated content"})
        });            
    });

    describe('GET /:id', () => {
        it('Should get a specific document', async () => {
            await request(app)
            .get('/' + docId)
            .expect(200)
        });
    });

    // Should be part of a teardown
    describe('POST /delete', () => {
        it('Should delete a document', async () => {
            await request(app)
            .post('/delete')
            .send({"id": docId})
            .expect(410);
        });
    });
});
