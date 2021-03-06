const {knex} = require('./db');
const {Tag} = require('./Tag');
const fs = require('fs');

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
            })
            .then(image => {
                if (image)
                    return image;
                else
                    return fs.readFileSync(__dirname + '/defaultProblemImage.png');
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
                    return knex.select({tagId: "tag.id", tagName: "tag.name",})
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

    static new(problem) {
        return knex("problems").insert(problem)
            .then(results => {
                if (results.length === 1)
                    return results[0];
                else
                    return results
            })
            .catch(error => {
                console.error(error);
                return false;
            })
    }

    static edit(id, problem) {
        return knex("problems")
            .where("id", "=", id)
            .update(problem)
            .then(results => {
                if (results.length === 1)
                    return results[0];
                else
                    return results
            })
            .catch(error => {
                console.error(error);
                return false;
            })
    }

    static deleteWithProtection(id){
        return knex("problem_has_tag")
            .where("fk_problem", "=", id)
            .delete()
            .then(() => Problem.delete(id))
    }

    static delete(id) {
        return knex("problems")
            .where("id", "=", id)
            .delete()
            .then(result => !!result)
            .catch(error => {
                console.error(error);
                return false;
            })
    }

    static tagger(id, tag) {
        if (!tag.id)
            return Tag.getOrCreateByName(tag.name)
                .then(createdTag => this.tagger(id, createdTag))
        else
            return knex("problem_has_tag").select("*")
                .where("fk_problem", "=", id)
                .andWhere("fk_tag", "=", tag.id)
                .then(results => {
                    if (results.length > 0)
                        return Tag.getById(tag.id);
                    else
                        return knex("problem_has_tag").insert({
                            fk_tag: tag.id,
                            fk_problem: id
                        })
                            .then(results => {
                                if (results)
                                    return Tag.getById(tag.id)
                            })
                })
    }

    static deleteTag(problemId, tagId) {
        return knex("problem_has_tag")
            .where("fk_problem", "=", problemId)
            .andWhere("fk_tag", "=", tagId)
            .delete()
            .then(result => !!result)
    }
}

module.exports = {Problem};
