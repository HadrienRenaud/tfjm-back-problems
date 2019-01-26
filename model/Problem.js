const {knex} = require('./db');
const {Tag} = require('./Tag');

class Problem {
    constructor(id, name, description, pdf, tex, medias) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.pdf = pdf;
        this.tex = tex;
        this.medias = medias;
        this.tags = []
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    static getById(id) {
        return knex.select('*').from('problems').where('id', '=', id).map(
            (row) => new Problem(row.id, row.name, row.description, row.pdf, row.tex, row.medias));
    }

    static getAll() {
        return knex.select('*').from('problems').map(
            (row) => new Problem(row.id, row.name, row.description, row.pdf, row.tex, row.medias));
    }

    static getByTag(tagId) {
        return knex.select('*').from('problem_has_tag')
            .innerJoin('problems', 'problems.id', 'problem_has_tag.fk_problem')
            .where('problem_has_tag.fk_tag', '=', tagId)
    }

    static getFullAll() {
        return Problem.getAll().then((probs) => {
            let result = [];
            probs.forEach(pb => {result[pb.id] = pb});
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
