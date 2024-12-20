const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header("auth-token");
    if (!token) return res.status(400).send("Access denied")

    try {
        const verified = jwt.verify(token, process.env.SECRET_JWT);
        req.user = verified;
        res.send(verified);
        next();
    } catch (err) {
        res.send(err);
    }
}