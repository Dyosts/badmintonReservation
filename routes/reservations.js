const express = require('express');
const router = express.Router();
const db = require('../database');
const {checkUserTokenMiddleware, checkAdminTokenMiddleware} = require('../jwt');
const HALResource = require("../hal");

/**
 * Utility function to check time conflicts
 * @param existingReservations
 * @param newDate
 * @param durationMinutes
 * @returns {*}
 */
function hasTimeConflict(existingReservations, newDate, durationMinutes = 60) {
    const newStart = new Date(newDate).getTime();
    const newEnd = newStart + durationMinutes * 60 * 1000;

    return existingReservations.some(reservation => {
        const existingStart = new Date(reservation.date).getTime();
        const existingEnd = existingStart + durationMinutes * 60 * 1000;

        return (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
        );
    });
}

// GET all reservations
// Secured with admin token
router.get('/reservations', checkAdminTokenMiddleware, function (req, res) {
    const resources = db.reservations.map(reservation => {
        const reservationResource = new HALResource(
            {
                id: reservation.id,
                date: reservation.date,
                field: reservation.fieldId,
                username: reservation.userId,
            },
            `/reservations/${reservation.id}`
        );
        return reservationResource.toJSON();
    });
    const response = new HALResource({}, `/reservations`);
    response.addEmbedded('reservations', resources);
    res.status(200).json(response.toJSON());
});

// GET specified reservation by id
// TODO reflexion about security
router.get('/reservations/:id(\\d+)', function(req, res) {
    const id = parseInt(req.params.id);
    const reservation = db.reservations.find(reservation => reservation.id === id);

    if(!reservation) {
        res.status(404).json({error: 'Reservation not found'});
    }

    const resource = new HALResource(
        {
            id: id,
            date: reservation.date,
            field: reservation.fieldId,
            username: reservation.userId,
        },
        `/reservations/${id}`
    );

    res.status(200).json(resource.toJSON());
});

// GET reservations from a specified field
// TODO reflexion about security
router.get('/fields/:id(\\d+)/reservations', function (req, res) {
    const fieldId = parseInt(req.params.id);
    const field = db.fields.find(field => field.id === fieldId);

    if(!field) {
        res.status(404).json({error: 'Field not found'});
    }

    const fieldReservations = db.reservations
        .filter(reservation => reservation.fieldId === fieldId)
        .map((reservation) =>
            new HALResource(
                {
                    id: reservation.id,
                    date: reservation.date,
                    field: reservation.fieldId,
                    user: reservation.userId,
                },
                `/reservations/${reservation.id}`
            ).toJSON()
        );
    const response = new HALResource({}, `/fields/${fieldId}/reservations`);
    response.addEmbedded('reservations', fieldReservations);

    res.status(200).json(response.toJSON());
});

// POST creation of a new reservation
// Secured by user token
router.post('/fields/:id(\\d+)/reservations', checkUserTokenMiddleware, function(req, res) {
   const fieldId = parseInt(req.params.id);
   const date = req.body.date;
   const userId = res.locals.decoded.login;

    const field = db.fields.find(f => f.id === fieldId);
    if (!field) {
        return res.status(404).json({ error: 'Field not found' });
    }

    if (!field.availability) {
        return res.status(400).json({ error: 'Field is not available for reservations' });
    }

    const fieldReservations = db.reservations.filter(r => r.fieldId === fieldId);
    if (hasTimeConflict(fieldReservations, date)) {
        return res.status(409).json({
            error: 'Field is already reserved for the specified time slot',
        });
    }

    const newId = db.reservations.length > 0 ? db.reservations[db.reservations.length - 1].id + 1 : 1;
    const newReservation = {
        id: newId,
        field: fieldId,
        date: date,
        user: userId,
    };
    db.reservations.push(newReservation);

    const resource = new HALResource(
        {
            message: `New reservation created`,
            data: newReservation
        },
        `/fields/${newReservation.field}/reservations/${newReservation.id}`
    );
    res.status(200).json(resource.toJSON());
});

// DELETE a reservation by id
// Secured by admin token
router.delete('/reservations/:id(\\d+)', checkAdminTokenMiddleware, function (req, res) {
    const id = parseInt(req.params.id);
    const reservationIndex = db.reservations.findIndex((r) => r.id === id);

    if(reservationIndex === -1) {
        res.status(404).json({error: "Reservation not found"})
    }

    db.reservations.splice(reservationIndex, 1);

    const resource = new HALResource(
        {
            message: `Reservation ${id} successfully deleted`
        }, `reservations/${id}`
    );
    res.status(200).json(resource.toJSON());
});

module.exports = router;