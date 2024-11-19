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

// La base de données

const fields = [
    new Field(1, 'A', true),
    new Field(2, 'B', false)
];

const users = [
    new User(1, 'admybad', 'admybad', true),
    new User(2, 'player1', 'password123', false),
    new User(3, 'player2', 'securepass', false),
    new User(4, 'player3', 'mypassword', false),
    new User(5, 'player4', 'pass4player', false)
];

module.exports = {fields, users};