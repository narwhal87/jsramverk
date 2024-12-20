const { default: mongoose } = require("mongoose");
const setup = require('../../db/setup.js');
const docs = require("../../docs.js");

process.env.NODE_ENV = 'test';

describe('Reports', () => {
    let app;
    let request;
    let docId;
    let token;

    beforeAll(async () => {
        // await setup();

        app = require("../../app");
        request = require('supertest');
        let user = {
            username: "test",
            password: "pwd123"
        }
        const response = await request(app)
            .post('/login')
            .send(user);

        token = response.body.token ? response.body.token : process.env.super_secret;
    });

    afterAll(() => {
        mongoose.connection.close();
        app.close();
    });

    describe('GET /', () => {
        it('Should return all documents', async () => {
            await request(app)
                .get("/")
                .send({"owner": "test"})
                .set('auth-token', `${token}`)
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
                .set('auth-token', `${token}`)
                .expect(201)
                .then(({ body }) => {
                    docId = body.insertedId;
                    expect(body.insertedId).toHaveLength(24);
                });
        });
    });

    describe('POST /update', () => {
        it('Should update a document', async () => {
            await request(app)
                .post("/update")
                .send({"title": "Updated title", "content": "Updated content", 'id': docId})
                .set('auth-token', `${token}`)
                .expect(200);
                
            const response = await request(app)
                .get('/doc/' + docId)
                .set('auth-token', `${token}`);

            expect(JSON.parse(response.text).data[0]).toMatchObject({'_id': docId,
                "title": "Updated title", "content": "Updated content"});
        });
    });

    describe('GET /doc/:id', () => {
        it('Should get a specific document', async () => {
            await request(app)
                .get('/doc/' + docId)
                .set('auth-token', `${token}`)
                .expect(200);
        });
    });

    // Should be part of a teardown
    describe('POST /delete', () => {
        it('Should delete a document', async () => {
            await request(app)
                .post('/delete')
                .send({"id": docId})
                .set('auth-token', `${token}`)
                .expect(200);
        });
    });

    describe('GET not found', () => {
        it('Should raise error message', async () => {
            await request(app)
                .get('/pizzaplace')
                .expect(404);
        });
    });

    describe('POST /register', () => {

        const registerBody = {
            username: "new2",
            password: "pwd123",
            email: "newem2@ail.com"
        }

        it('Should create a new user', async () => {
            await request(app)
                .post('/register')
                .send(registerBody)
                .expect(200);
        })
    });

    describe('POST /share', () => {
        it('Should share a document', async () => {

            const shareBody = {
                "id": "09u09saoishjdapoisjd",
                "email": "testbuddy@test.com"
            }
            // Mock the mailgun call
            // console.log(mailgun)
            docs.share = jest.fn();
            await request(app)
                .post('/share')               
                .send(shareBody)
                .set('auth-token', `${token}`)
                .expect(200);
        });

        it('Should fail to share a document', async () => {
            docs.share = jest.fn().mockImplementation(() => {
                throw new Error('Database on fire')
        });
            await request(app)
                .post('/share')
                .send()
                .set('auth-token', `${token}`)
                .expect(500);
        })
    });
});
