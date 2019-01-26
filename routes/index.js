const express = require('express');
const router = express.Router();
const {Problem} = require('../model/Problem');
/* GET home page. */

router.get('/index', function (req, res, next) {
    Problem.getFullAll().then(result => res.json(result));
});

router.get('/problem/:id', function(req, res, next) {
    Problem.getFullById(req.params.id).then(result => res.json(result))
})

router.get('/', function(req, res, next) {
    res.send("Index on '/index'")
});

module.exports = router;
