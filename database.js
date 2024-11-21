const bcrypt = require('bcrypt');

// Les Modèles de données

class Field {
    constructor(id, name, availability = true) {
        this.id = id;
        this.name = name;
        this.availability = availability;
    }
}

const saltOrRounds = 5;

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

// La base de données

const fields = [
    new Field(1, 'A', true),
    new Field(2, 'B', false),
    new Field(3, 'C', true),
    new Field(4, 'D', true),
];

const users = [
    new User(1, 'admybad', 'admybad', true),
    new User(2, 'player1', 'password123', false),
    new User(3, 'player2', 'securepass', false),
    new User(4, 'player3', 'mypassword', false),
    new User(5, 'player4', 'pass4player', false)
];

const reservations = [
    new Reservation(1, '2024-11-19 10:00', 1, 2),
    new Reservation(2,'2024-11-19 11:00', 1, 2),
    new Reservation(3,'2024-11-19 12:00', 2, 4),
    new Reservation(4,'2024-11-19 13:00', 3,5),
    new Reservation(5,'2024-11-19 14:00', 4,3)
];

module.exports = {fields, users, reservations};