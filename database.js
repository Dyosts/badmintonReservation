// Les Modèles de données

class Field {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
// La base de données

const fields = [
    new Field(1, 'A'),
    new Field(2, 'B')
];

module.exports = {fields};