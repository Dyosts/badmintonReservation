const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('../jwt');
const HALResource = require("../hal");
// @ts-ignore
const rateLimit = require('express-rate-limit');

/**
 * Return true if user is authenticated by system
 * @param {*} login
 * @param {*} password
 * @returns
 */
function authenticate(login, password) {
    const user = db.users.find((user) => {
        return user.login === login && bcrypt.compareSync(password, user.password);
    });
    return user !== undefined;
}

/**
 * Search user with username
 * @param login
 * @returns {User}
 */
function findUserByPseudo(login) {
    return db.users.find((user) => user.login === login);
}

/**
 * Check if user is an admin
 * @param login
 * @returns {*}
 */
function checkAdmin(login) {
    const user = findUserByPseudo(login);
    return user.isAdmin;
}

/**
 * Express rate limiter function
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
});

// POST Authenticate with login and password
router.post("/login", limiter, (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const isAdmin = checkAdmin(login);
    const EXPIRATION = '1 day';

    if(authenticate(login, password)) {
        // User authenticated, create JWT
        const accessToken = jwt.createJWT(login, isAdmin, EXPIRATION);

        const resource = new HALResource(
            {
                jwt: accessToken,
                message: `Bonjour ${login}`
            },
            `/login`
        );

        res.status(200).json(resource.toJSON());
    } else {
        res.status(403).json({error: "Incorrect login or password"});
    }
});
module.exports = router;