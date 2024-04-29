const { blacklistModel } = require("../models/blacklist.schema");
require('dotenv').config();
const jwt = require('jsonwebtoken')
const auth = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send({ error: 'Unauthorized. Token missing.' });
    }

    const blacklistedToken = await blacklistModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).send({ error: 'Unauthorized. Token revoked.' });
    }

    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Unauthorized. Invalid token.' });
        }
        req.userID = decoded.userID;
        req.role = decoded.role;
        next(); 
    });
};


module.exports ={
    auth
}