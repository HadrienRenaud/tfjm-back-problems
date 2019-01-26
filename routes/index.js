const express = require('express');
const router = express.Router();
const {Problem} = require('../model/Problem');
const {Tag} = require('../model/Tag');
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

router.get('/problem/:id/pdf', function(req, res, next) {
    Problem.getPdfById(req.params.id).then(result => res.json(result))
})

router.get('/problem/:id/tex', function(req, res, next) {
    Problem.getTexById(req.params.id).then(result => res.json(result))
})

router.get('/problem/:id/medias', function(req, res, next) {
    Problem.getMediasById(req.params.id).then(result => res.json(result))
})

router.get('/problem/:id', function(req, res, next) {
    Problem.getFullById(req.params.id).then(result => res.json(result))
})

router.get('/', function(req, res, next) {
    res.send("Index on '/index'")
});

module.exports = router;
