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
    constructor(id, field, date, user) {
        this.id = id;
        this.field = field;
        this.date = date;
        this.user = user;
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
    new Reservation(1, 'A', '2024-11-19 10:00', 'player1'),
    new Reservation(2, 'A','2024-11-19 11:00', 'player1'),
    new Reservation(3, 'B','2024-11-19 12:00', 'player3'),
    new Reservation(4, 'C','2024-11-19 13:00', 'player4'),
    new Reservation(5, 'D','2024-11-19 14:00', 'player2')
];

module.exports = {fields, users, reservations};