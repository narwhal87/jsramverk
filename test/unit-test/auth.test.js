process.env.NODE_ENV = 'test';

const auth = require('../../models/auth.js');
const jwt = require('jsonwebtoken');
const User = require('../../db/users.js');

describe('Testing auth model', () => {

    test('Testing checkUser function no token', () => {
        const fakeRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const fakeReq = {
            header: jest.fn().mockReturnValue(null),
        };

        auth.checkUser(fakeReq, fakeRes);
        expect(fakeRes.send).toHaveBeenCalledWith("Access denied!");
    });

    test('Testing checkUser function jwt fail', () => {
        const fakeRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const fakeReq = {
            header: jest.fn().mockReturnValue('piawdpiha'),
        };

        auth.checkUser(fakeReq, fakeRes);
        expect(fakeRes.send).toHaveBeenCalledWith("Access denied!");
    });

    test('Testing checkUser function no user', async () => {
        const fakeRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const fakeReq = {
            header: jest.fn().mockReturnValue('piawdpiha')
        };
        jwt.decode = jest.fn().mockReturnValue("coolUserId");
        User.findById = jest.fn().mockReturnValue(null)
        await auth.checkUser(fakeReq, fakeRes);
        expect(fakeRes.send).toHaveBeenCalledWith("Access denied!");
    });

    test('Testing checkUser function success', async () => {
        const fakeRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const fakeReq = {
            header: jest.fn().mockReturnValue('piawdpiha')
        };
        jwt.decode = jest.fn().mockReturnValue("coolUserId");
        User.findById = jest.fn().mockReturnValue({username: "Apan", userID: "apeId"})
        let result = await auth.checkUser(fakeReq, fakeRes);
        expect(result.username).toBe("Apan");
        expect(result.userID).toBe(undefined);
    });
});
