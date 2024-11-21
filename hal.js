class HALResource {
    /**
     * HAL resource constructor
     * @param {Object} data
     * @param {string} selfLink
     */
    constructor(data, selfLink) {
        this._links = {
            self: {
                href: selfLink
            }
        };
        Object.assign(this, data);
    }

    /**
     * Add link to resource
     * @param {string} rel
     * @param {string} href
     */
    addLink(rel, href) {
        if (!this._links[rel]) {
            this._links[rel] = {
                href
            };
        }
    }

    /**
     * Add embedded to resource
     * @param {string} rel
     * @param {HALResource|HALResource[]} resource
     */
    addEmbedded(rel, resource) {
        if (!this._embedded) {
            this._embedded = {};
        }

        if (!this._embedded[rel]) {
            this._embedded[rel] = [];
        }

        if (Array.isArray(resource)) {
            this._embedded[rel].push(...resource);
        } else {
            this._embedded[rel].push(resource);
        }
    }

    /**
     * Serialize resource to json
     * @returns {Object}
     */
    toJSON() {
        return {
            ...this,
        };
    }
}

module.exports = HALResource;