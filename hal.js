/**
 * Export des fonctions helpers pour la spécification HAL
 * Voir la spécification HAL : https://stateless.group/hal_specification.html
 * Voir la spécification HAL (RFC, source) : https://datatracker.ietf.org/doc/html/draft-kelly-json-hal
 */

/**
 * Retourne un Link Object, conforme à la spécification HAL
 * @param {*} url
 * @param {*} type
 * @param {*} name
 * @param {*} templated
 * @param {*} deprecation
 * @returns
 */
function halLinkObject(url, type = '', name = '', templated = false, deprecation = false) {

    return {
        "href": url,
        "templated": templated,
        ...(type && { "type": type }),
        ...(name && { "name": name }),
        ...(deprecation && { "deprecation": deprecation })
    }
}

/**
 * Retourne une représentation Ressource Object (HAL) d'un terrain
 * @param {*} fieldData Données brutes d'un terrain
 * @returns un Ressource Object Field (spec HAL)
 */
function mapFieldtoResourceObject(fieldData) {
    return {
        "_links": {
            // A compléter
            "self": halLinkObject(`/fields/${fieldData.id}`),
            "concerts": halLinkObject(`/fields`),
            "book": halLinkObject(`/fields/${fieldData.id}/reservations`),
            // "reservation": halLinkObject(...)
        },

        //Données d'un terrain à ajouter ici...
        nom: fieldData.name
    }
}

function mapFieldListToResourceObject(fields) {

    // Préparer les terrains "embarqués" comme ressource
    // par la ressource "la liste des terrains"
    const embedded = fields.map(concert => mapFieldtoResourceObject(fields));

    // La liste des terrains
    return {
        "_links": {
            "self": halLinkObject(`/fields`),
        },

        "_embedded": {
            "concerts": embedded,
        }
    }
}

module.exports = { halLinkObject, mapFieldtoResourceObject, mapFieldListToResourceObject };
