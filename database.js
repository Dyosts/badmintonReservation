const bcrypt = require('bcrypt');
const saltOrRounds = 5;

class Field {
    constructor(id, name, availability = true) {
        this.id = id;
        this.name = name;
        this.availability = availability;
    }
}

class User {
    constructor(id, login, password, isAdmin) {
        this.id = id;
        this.login = login;
        this.password = bcrypt.hashSync(password, saltOrRounds);
        this.isAdmin = isAdmin;
    }
}

class Reservation {
    constructor(id, date, fieldId, userId) {
        this.id = id;
        this.date = date;
        this.fieldId = fieldId;
        this.userId = userId;
    }
}

// Gestionnaire de base de données
class Database {
    constructor() {
        this.fields = [
            new Field(1, 'A', true),
            new Field(2, 'B', false),
            new Field(3, 'C', true),
            new Field(4, 'D', true),
        ];

        this.users = [
            new User(1, 'admybad', 'admybad', true),
            new User(2, 'player1', 'password123', false),
            new User(3, 'player2', 'securepass', false),
            new User(4, 'player3', 'mypassword', false),
            new User(5, 'player4', 'pass4player', false),
        ];

        this.reservations = [
            new Reservation(1, '2024-11-19 10:00', 1, 2),
            new Reservation(2, '2024-11-19 11:00', 1, 2),
            new Reservation(3, '2024-11-19 12:00', 2, 4),
            new Reservation(4, '2024-11-19 13:00', 3, 5),
            new Reservation(5, '2024-11-19 14:00', 4, 3),
        ];
    }

    // Fields methods
    getFields() {
        return this.fields;
    }

    getFieldById(id) {
        return this.fields.find(field => field.id === id);
    }

    addField(name, availability = true) {
        const newField = new Field(this.fields.length + 1, name, availability);
        this.fields.push(newField);
        return newField;
    }

    updateField(id, updates) {
        const field = this.getFieldById(id);

        if (!field) {
            return null;
        }

        if (field) {
            Object.assign(field, updates);
        }
        return field;
    }

    // Reservations methods
    getReservations() {
        return this.reservations;
    }

    getReservationById(id) {
        return this.reservations.find(reservation => reservation.id === id);
    }

    getReservationsByFieldId(fieldId) {
        return this.reservations.filter(reservation => reservation.fieldId === fieldId);
    }

    addReservation(date, fieldId, userId) {
        const newReservation = new Reservation(
            this.reservations.length + 1,
            date,
            fieldId,
            userId
        );
        this.reservations.push(newReservation);
        return newReservation;
    }

    deleteReservation(id) {
        const index = this.reservations.findIndex(reservation => reservation.id === id);
        if (index !== -1) {
            return this.reservations.splice(index, 1)[0];
        }
        return null;
    }
}

const db = new Database();

module.exports = db;