const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {Problem} = require('../model/Problem');
const {Tag} = require('../model/Tag');

router.use(bodyParser.json());

/* GET home page. */
router.get('/index', function (req, res, next) {
    Problem.getFullAll().then(pbs => {
        Tag.getAll().then(tags =>
            res.json({
                problems: pbs,
                tags: tags
            })
        )
    });
});

router.get('/problem/:id.pdf', function(req, res, next) {
    Problem.getPdfById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id.tex', function(req, res, next) {
    Problem.getTexById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id.zip', function(req, res, next) {
    Problem.getMediasById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id/image', function(req, res, next) {
    Problem.getImageById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id', function(req, res, next) {
    Problem.getFullById(req.params.id).then(result => res.json(result))
});

router.get('/', function(req, res, next) {
    res.send("Index on '/index'")
});

router.post('/problem', function(req, res) {
    Problem.new(req.body)
        .then((result) => result ? res.status(201).send(JSON.stringify(result)) : res.status(400).send())
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while creating the Problem. The problem might or might not have been created.")
        })
});

router.patch('/problem/:id', function(req, res) {
    Problem.edit(req.params.id, req.body)
        .then((result) => result ? res.status(204).send() : res.status(400).send())
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while editing the Problem. The problem might or might not have been edited.")
        })
});

router.delete('/problem/:id', function(req, res) {
    Problem.delete(req.params.id)
        .then((result => res.status(204).send()))
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while deleting the Problem. The problem might or might not have been deleted.")
        })
});

router.put('/problem/:id/tag', function (req, res) {
    Problem.tagger(req.params.id, req.body)
        .then(result => res.status(200).send(result))
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while tagging the Problem. The problem might or might not have been tagged.")
        })
});

router.delete('/problem/:id/tag/:tag', function(req, res) {
    Problem.deleteTag(req.params.id, req.params.tag)
        .then(result => result ? res.status(204).send() : res.status(404).send())
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while untagging the Problem. The problem might or might not have been untagged.")
        })
});

module.exports = router;
