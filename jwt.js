const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');

// Check .env in case of server deployment
const SECRET = process.env.JWT_SECRET || fs.readFileSync('private.key');

/**
 * Extract bearer token
 * @param headerValue
 * @returns {string|null}
 */
const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return null;
    }
    const matches = headerValue.match(/(bearer)\s+(\S+)/i);
    return matches && matches[2];
};

/**
 * @param isAdminCheck
 * @returns {(function(*, *, *): (*|undefined))|*}
 */
const checkTokenMiddleware = (isAdminCheck = false) => (req, res, next) => {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    jsonwebtoken.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        if (!decoded.login || typeof decoded.isAdmin === 'undefined') {
            return res.status(401).json({ error: 'Malformed token' });
        }

        if (isAdminCheck && !decoded.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Admins only' });
        }

        res.locals.decoded = decoded;

        next();
    });
};

const checkUserTokenMiddleware = checkTokenMiddleware(false);
const checkAdminTokenMiddleware = checkTokenMiddleware(true);

/**
 * JWT Creation
 * @param login
 * @param isAdmin
 * @param EXPIRATION
 * @returns {*}
 */
function createJWT(login, isAdmin, EXPIRATION) {
    try {
        return jsonwebtoken.sign(
            { login, isAdmin },
            SECRET,
            { expiresIn: EXPIRATION }
        );
    } catch (error) {
        console.error('Error creating JWT:', error);
        throw new Error('Token creation failed');
    }
}

module.exports = { createJWT, checkAdminTokenMiddleware, checkUserTokenMiddleware };