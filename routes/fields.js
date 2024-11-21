const express = require('express');
const router = express.Router();
const db = require('../database');
const HALResource = require('../hal');
const {checkAdminTokenMiddleware} = require("../jwt");

// GET all fields
// Not secured
router.get('/fields', function(req, res) {
    const resources = db.fields.map(field => {
        const fieldResource = new HALResource(
            {
                id: field.id,
                name: field.name,
                availability: field.availability,
            },
            `/fields/${field.id}`
        );
        return fieldResource.toJSON();
    });
    const response = new HALResource({}, '/fields');
    response.addEmbedded('fields', resources);

    res.status(200).json(response.toJSON());
});

// GET specified field by ID
// Not secured
router.get('/fields/:id(\\d+)', function(req, res) {
    const fieldId = parseInt(req.params.id);
    const field = db.fields.find(field => field.id === fieldId);

    if(!field) {
        res.status(404).json({error: 'Field not found'});
    }

    const resource = new HALResource(
        {
            id: field.id,
            name: field.name,
            availability: field.availability,
        },
        `/fields/${field.id}`
    );

    resource.addLink('reservations', `fields/${field.id}/reservations`);

    res.status(200).json(resource.toJSON());
});

// PUT Change availability of a specified field
// Secured by admin token
router.put('/fields/:id(\\d+)', checkAdminTokenMiddleware, function(req, res) {
    const fieldId = parseInt(req.params.id);
    const field = db.fields.find(field => field.id === fieldId);

    if(!field) {
        res.status(404).json({error: 'Field not found'});
    }

    field.availability = !field.availability;
    const resource = new HALResource(
        {
            id: field.id,
            name: field.name,
            availability: field.availability,
        },
        `/fields/${field.id}`
    );

    resource.addLink('reservations', `fields/${field.id}/reservations`);

    res.status(200).json(resource.toJSON());
})

module.exports = router;