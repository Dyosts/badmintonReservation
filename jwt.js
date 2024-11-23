const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');

const SECRET = fs.readFileSync('private.key');

const extractBearerToken = headerValue => {
    if(typeof headerValue !== 'string'){
        return false;
    }
    const matches = headerValue.match(/(bearer)\s+(\S+)/i);
    return matches && matches[2];
};

const checkAdminTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json('Not authorized');
    }

    jsonwebtoken.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Not authorized'});
        }

        if (!decoded.isAdmin) {
            return res.status(403).json('Forbidden: Admins only');
        }

        res.locals.decoded = decoded;

        next();
    });
};

const checkUserTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json('Not authorized');
    }

    jsonwebtoken.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Not authorized'});
        }

        res.locals.decoded = decoded;

        next();
    });
};

/**
 * Retourne un jwt signé avec une date d'expiration
 * @param login
 * @param isAdmin
 * @param EXPIRATION
 * @returns {*}
 */
function createJWT(login, isAdmin, EXPIRATION) {
    return jsonwebtoken.sign(
        {
            login: login,
            isAdmin: isAdmin
        },
        SECRET, {
            expiresIn: EXPIRATION,
        }
    );
}

module.exports = {createJWT, checkAdminTokenMiddleware, checkUserTokenMiddleware};