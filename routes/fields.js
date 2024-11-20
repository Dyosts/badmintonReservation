const express = require('express');
const router = express.Router();
const db = require('../database');
const hal = require('../hal');
const {checkAdminTokenMiddleware} = require("../jwt");


router.get('/fields', function(req, res) {
    const resourceObject = hal.mapFieldListToResourceObject(db.fields);
    res.status(200).json(resourceObject);
});

router.get('/fields/:id(\\d+)', function(req, res) {

    // Récupérer l'id renseigné dans le path
    const id = parseInt(req.params.id);

    // Trouver le terrain
    const field = db.fields.find((field) => field.id === id);

    if(field === undefined){
        res.status(404).json({})
    }

    const fieldResourceObject = hal.mapFieldToResourceObject(field);

    res.status(200).json(fieldResourceObject);

});

router.put('/fields/:id(\\d+)', checkAdminTokenMiddleware, function(req, res) {

    // Récupérer l'ID dans le path
    const id = parseInt(req.params.id);

    // Trouver le terrain
    const field = db.fields.find((field) => field.id === id);

    if (field === undefined){
        res.status(404).json({})
    }

    field.availability = !field.availability;

    const fieldResourceObject = hal.mapFieldToResourceObject(field);
    console.log(res.locals.decoded);
    res.status(200).json(fieldResourceObject);
})

module.exports = router;