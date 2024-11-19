const express = require('express');
const router = express.Router();
const db = require('../database');
const hal = require('../hal');
const bcrypt = require('bcrypt');
const jwt = require('../jwt');

/**
 * Retourne vrai si l'user est authentifié par le système, faux sinon
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
 * Recherche un utilisateur à partir de son pseudo
 * @param login
 * @returns {User}
 */
function findUserByPseudo(login) {
    return db.users.find((user) => user.login === login);
}

/**
 * Vérifie si un utilisateur est admin
 * @param pseudo
 * @returns {*}
 */
function isAdmin(pseudo) {
    const user = findUserByPseudo(pseudo);
    return user.isAdmin;
}

router.post("/login", (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    let admin = false;

    // Si authentifié
    if(authenticate(login, password)) {

        // Si admin
        if (isAdmin(login)) {
            admin = true;
        }

        // User est authentifié: Génération d'un access token
        const accessToken = jwt.createJWT(login, admin, '1  day');
        // Si réussi, on va fournir un hypermédia JSON HAL (lien vers reservations + access token)
        const resourceObject = hal.mapLoginToResourceObject(login, accessToken);

        res.status(200).json(resourceObject);

    } else {
        // Sinon, on retourne un message d'erreur
        let responseObject = {
            "_links": {
                "self": hal.halLinkObject(`/login`),
            },
            message: "Vos identifiants sont invalides. Merci de réessayer."
        };

        res.status(401).format({
            "application/hal+json": function () {
                res.send(responseObject);
            },
        });
    }
});

module.exports = router;