const {knex} = require('./db');
const {Tag} = require('./Tag');

class Problem {
    constructor(id, name, description, pdf, tex, medias, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.pdf = pdf;
        this.tex = tex;
        this.medias = medias;
        this.image = image;
        this.tags = []
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    static getById(id) {
        return knex.select('*').from('problems').where('id', '=', id)
            .map((row) => new Problem(row.id, row.name, row.description, row.pdf, row.tex, row.medias, row.image))
            .then(result => {
                if (result.length > 0)
                    return result[0];
                else
                    return false
            });
    }

    static getRestrictedById(id) {
        return knex.select('id', 'name', 'description').from('problems').where('id', '=', id)
            .map((row) => new Problem(row.id, row.name, row.description))
            .then(result => {
                if (result.length > 0)
                    return result[0];
                else
                    return false
            });
    }

    static getPdfById(id) {
        return knex.select('*').from('problems').where('id', '=', id)
            .map((row) => row.pdf)
            .then(result => {
                if (result.length > 0)
                    return result[0];
                else
                    return false
            });
    }

    static getImageById(id) {
        return knex.select('image').from('problems').where('id', '=', id)
            .map((row) => row.image)
            .then(result => {
                if (result.length > 0)
                    return result[0];
                else
                    return false
            });
    }

    static getTexById(id) {
        return knex.select('*').from('problems').where('id', '=', id)
            .map((row) => row.tex)
            .then(result => {
                if (result.length > 0)
                    return result[0];
                else
                    return false
            });
    }

    static getMediasById(id) {
        return knex.select('*').from('problems').where('id', '=', id)
            .map((row) => row.medias)
            .then(result => {
                if (result.length > 0)
                    return result[0];
                else
                    return false
            });
    }

    static getAll() {
        return knex.select('*').from('problems').map(
            (row) => new Problem(row.id, row.name, row.description, row.pdf, row.tex, row.medias, row.image));
    }

    static getAllRestricted() {
        return knex.select('id', 'name', 'description').from('problems').map(
            (row) => new Problem(row.id, row.name, row.description));
    }

    static getByTag(tagId) {
        return knex.select('*').from('problem_has_tag')
            .innerJoin('problems', 'problems.id', 'problem_has_tag.fk_problem')
            .where('problem_has_tag.fk_tag', '=', tagId)
    }

    static getFullById(id) {
        return Problem.getRestrictedById(id)
            .then(result => {
                if (result) {
                    return knex.select({ tagId: "tag.id", tagName: "tag.name", })
                        .from('problem_has_tag').innerJoin('tag', 'problem_has_tag.fk_tag', 'tag.id')
                        .where('problem_has_tag.fk_problem', '=', result.id)
                        .then(rows => {
                            rows.forEach(row => result.addTag(new Tag(row.tagId, row.tagName)));
                            return result;
                        })
                } else return false
            })
    }

    static getFullAll() {
        return Problem.getAllRestricted().then((probs) => {
            let result = [];
            probs.forEach(pb => {
                result[pb.id] = pb
            });
            return knex.select({
                tagId: "tag.id",
                tagName: "tag.name",
                probId: "problem_has_tag.fk_problem"
            })
                .from('tag').innerJoin('problem_has_tag', 'problem_has_tag.fk_tag', 'tag.id')
                .then((rows) => {
                    rows.forEach(row => {
                        result[row.probId].addTag(new Tag(row.tagId, row.tagName))
                    });
                    return result;
                })
        })
    }
}

module.exports = {Problem};
