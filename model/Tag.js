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

    static getOrCreateByName(name) {
        return this.getByName(name)
            .then(results => {
                if (results.length === 0) {
                    return knex("tag").insert({name: name})
                        .then(() => this.getByName(name))
                        .then(results => results[0])
                } else
                    return results[0]
            })
    }
}

module.exports = {Tag};
