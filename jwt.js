const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');

const SECRET = fs.readFileSync('private.key');

// Fonction pour extraire le token après "Bearer "
const extractBearerToken = (authorization) => {
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.split(' ')[1];
    }
    return null;
};

const checkTokenMiddleware = (req, res, next) => {
    // Récupérer le JWT envoyé par le client
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);

    // Si pas de JWT
    if (!token) {
        return res.status(401).send('Not authorized');
    }

    // Vérification du JWT
    jsonwebtoken.verify(token, SECRET, (err, decoded) => {
        if (err) {
            // La vérification a échoué
            return res.status(401).send('Not authorized');
        }

        // Vérification si isAdmin est true
        if (!decoded.isAdmin) {
            return res.status(403).send('Forbidden: Admins only');
        }

        // Partager des données entre middlewares si nécessaire
        res.locals.decoded = decoded;

        // Passer au middleware suivant
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

module.exports = {createJWT, checkTokenMiddleware};