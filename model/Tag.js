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
        return knex.select('*').from('tag').where("id", '=', id)
            .map((row) => new Tag(row.id, row.name))
            .then(results => {
                if (results)
                    return results[0];
                else
                    return false
            })
    }

    static getByName(name) {
        return knex.select('*').from('tag').where("name", "=", name)
            .map((row) => new Tag(row.id, row.name))
            .then(results => {
                if (results)
                    return results[0];
                else
                    return false
            })
    }

    static getOrCreateByName(name) {
        return this.getByName(name)
            .then(result => {
                if (!result) {
                    return knex("tag").insert({name: name})
                        .then(() => this.getByName(name))
                } else
                    return result
            })
    }
}

module.exports = {Tag};
