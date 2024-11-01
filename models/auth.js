const jwt = require('jsonwebtoken');
const User = require('../db/users.js');

const auth = {
    checkToken: function checkToken(req, res, next) {
        const token = req.headers['auth-token'];
        if (!token) return res.status(400).send("Access denied")

        try {
            const verified = jwt.verify(token, process.env.SECRET_JWT);
            req.user = verified;
            next();
        } catch (err) {
            res.send(err);
        }
    },

    // Is this used anywhere?
    checkUser: async function checkUser(req, res) {
        const token = req.header('auth-token');
        if (!token) return res.status(400).send("Access denied!");

        const userID = jwt.decode(token, process.env.SECRET_JWT);
        if (!userID) return res.status(400).send("Access denied!");

        const currentUser = await User.findById(userID.id);
        console.log(currentUser);
        if (!currentUser) return res.status(400).send("Access denied!");
        return {
            ...req.body,
            username: currentUser.username,
            userID: userID.id
        }
    }
}

module.exports = auth;