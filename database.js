// Les Modèles de données


class User {
    constructor(id, nickname, password, role) {
        this.id = id;
        this.nickname = nickname;
        this.password = password;
        this.role = role;
    }
}
class Field {
    constructor(id) {
        this.id = id;
    }
}

// La base de données

const fields = [
    new Field(1)
];

module.exports = {fields};