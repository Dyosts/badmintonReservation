const express = require('express');
const router = express.Router();
const db = require('../database');
const hal = require('../hal');
const {checkUserTokenMiddleware, checkAdminTokenMiddleware} = require('../jwt');

router.get('/fields/:id(\\d+)/reservations', checkAdminTokenMiddleware, function (req, res) {
    const resourceObject = hal.mapReservationListToResourceObject(db.reservations);
    res.status(200).json(resourceObject);
})

router.get('/fields/:id(\\d+)/reservations/:id(\\d+)', function(req, res) {

    const id = parseInt(req.params.id);

    const reservation = db.reservations.find((reservation) => reservation.id === id);

    if (reservation === undefined){
        res.status(404).json({})
    }

    const resourceObject = hal.mapReservationToResourceObject(reservation);

    res.status(200).json(resourceObject);
});

router.post('/fields/:id(\\d+)/reservations', checkUserTokenMiddleware, function(req, res) {
    const field = req.body.field;
    const date = req.body.date;
    const user = res.locals.decoded.login;

    if (!date || !field) {
        res.status(404).json({error: "Date et terrain requis"});
    }

    const newId = db.reservations.length > 0 ? db.reservations[db.reservations.length - 1].id + 1 : 1;
    const newReservation = {
        id: newId,
        field: field,
        date: date,
        user: user,
    };

    db.reservations.push(newReservation);
    const resourceObject = hal.mapReservationListToResourceObject(db.reservations);
    res.status(200).json(resourceObject);

});

module.exports = router;