var express = require('express');
var router = express.Router();
var db = require('../database');
var hal = require('../hal');

router.get('/fields', function(req, res) {
    const resourceObject = hal.mapFieldListToResourceObject(db.fields);
    res.status(200).json(resourceObject);
});

router.get('/fields/:id(\\d+)', function(req, res, next) {

    // Récupérer l'id renseigné dans le path
    const id = parseInt(req.params.id);

    // Trouver le concert
    const field = db.fields.find((field) => field.id === id);

    if(field === undefined){
        res.status(404).json({})
    }

    const fieldResourceObject = hal.mapFieldtoResourceObject(field);

    res.status(200).json(fieldResourceObject);

});

module.exports = router;