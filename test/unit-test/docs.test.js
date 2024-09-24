process.env.NODE_ENV = 'test';

const docs = require('../../docs');
const setup = require('../../db/setup.js');

describe('Testing docs.js success', () => {
    let docId;
    let toRemove;

    beforeAll(async () => {
        await setup();
        let all = await docs.getAll();

        expect(all.length).toBeGreaterThan(1);
        docId = all[0]._id.toString();
        toRemove = all[1]._id.toString();
    }, 5000);

    describe('GetAll', () => {
        it('Should return all documents', async () => {
            let all = await docs.getAll();

            expect(typeof all).toBe('object');
            expect(all[0]).toHaveProperty('_id');
            docId = all[0]._id.toString();
            toRemove = all[1]._id.toString();
        });
    });

    describe('addOne', () => {
        it('Should add a document to the database', async () => {
            let added = await docs.addOne({'title': 'boll', 'content': 'rullar'});

            expect(added).toHaveProperty('insertedId');
            expect(added).toHaveProperty('acknowledged');
        });
    });

    describe('GetOne', () => {
        it('Should return one document', async () => {
            let one = await docs.getOne(docId);

            expect(typeof one).toBe('object');
            expect(one[0]).toHaveProperty('_id');
            expect(one[0]).toHaveProperty('title');
            expect(one[0]).toHaveProperty('content');
        });
    });

    describe('removeOne', () => {
        it('Should remove one document from the database', async () => {
            await docs.remove({'id': toRemove});
            let all = await docs.getAll();

            all.forEach(document => {
                expect(document._id.toString()).not.toMatch(toRemove);
            });
        });
    });
});

describe('Testing docs.js fail', () => {
    beforeAll(() => {
        // Makes console.error not show in terminal.
        jest.spyOn(console, 'error').mockImplementation(jest.fn());
        //Mock db.collection.find to raise error.
        const database = require('../../db/database.js');
        const mockDb = { collection: {
            find: jest.fn().mockImplementation(() => {
                throw new Error('Database on fire');
            })
        },
        client: {
            close: function close() {
                return "ok";
            }
        }
        };

        database.getDb = jest.fn().mockReturnValue(mockDb);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('GetAll fail', () => {
        it('Should fail to connect to database and return an empty array', async () => {
            let all = await docs.getAll();

            expect(all).toEqual([]);
        });
    });

    describe('getOne fail', () => {
        it('Should fail to connect to database and return an empty object', async () => {
            let one = await docs.getOne('AF2473060B1C0D0A138842E7');

            expect(one).toEqual({});
        });
    });

    describe('getOne fail - id wrong length', () => {
        it('Should fail to connect to database and return an empty object', async () => {
            let one = await docs.getOne('AF2473060B1C0D0A138842');

            expect(one).toEqual({});
        });
    });

    describe('addOne fail', () => {
        it('Should fail to connect to database and return nothing', async () => {
            let empty = await docs.addOne({'title': 'fail', 'content': 'fail'});

            expect(empty).toBeUndefined();
        });
    });

    describe('update fail', () => {
        it('Should fail to connect to database and return nothing', async () => {
            let empty = await docs.update({'id': 'banan', 'title': 'fail', 'content': 'fail'});

            expect(empty).toBeUndefined();
        });
    });

    describe('remove fail', () => {
        it('Should fail to connect to database and return nothing', async () => {
            let empty = await docs.remove({'id': 'banan'});

            expect(empty).toBeUndefined();
        });
    });
});
