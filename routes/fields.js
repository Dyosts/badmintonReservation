var express = require('express');
var router = express.Router();
var db = require('../database');

router.get('/fields', function(req, res) {
    res.status(200).send("A implementer...");
});

module.exports = router;