const jwt = require('jsonwebtoken');

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
    }
}

module.exports = auth;