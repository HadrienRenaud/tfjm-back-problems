const {knex} = require('./db');

class Tag {

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static getAll() {
        return knex.select('*').from('tag').map((row) => new Tag(row.id, row.name))
    }

    static getById(id) {
        return knex.select('*').from('tag').where("id", '=', id).map((row) => new Tag(row.id, row.name))
    }

    static getByName(name) {
        return knex.select('*').from('tag').where("name", "=", name).map((row) => new Tag(row.id, row.name))
    }
}

module.exports = {Tag};
