const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require("cors");
const passport = require("passport");
const {Strategy} = require('passport-local');
const {Problem} = require('../model/Problem');
const {Tag} = require('../model/Tag');

const adminUser = process.env.ADMIN_USER || "admin";
const adminPasswd = process.env.ADMIN_PASSWD || "9GoepfS4ix32Y6aNqTVW3vGfRvXv36";
const sessionSecret = process.env.SESSION_SECRET || "83Vdhg2JtLBQKJbXBrqYhRVR62ryrW";
const frontURL = process.env.FRONT_URL || "http://localhost:3001";

const router = express.Router();

const corsOptions = {
    origin: true,
    credentials: true,
    preflightContinue: true,
};

router.use(cors(corsOptions));
router.use(bodyParser.json());
router.use(session({secret: sessionSecret, resave: false, saveUninitialized: false}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new Strategy((username, password, done) => {
        if (username === adminUser && password === adminPasswd)
            done(null, username);
        else
            done(null, false, {message: 'Incorrect username or password.'});
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

router.post("/login", passport.authenticate('local'), function (req, res) {
    res.status(200).send("Successfully authentified.");
});
router.get("/login", isAuthenticated, function (req, res) {
    res.status(200).send("Successfully authentified.");
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(403).send();
}

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

router.get('/tags', function (req, res) {
    Tag.getAll().then(result => res.send(result))
});

router.get('/problem/:id.pdf', function (req, res, next) {
    Problem.getPdfById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id.tex', function (req, res, next) {
    Problem.getTexById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id.zip', function (req, res, next) {
    Problem.getMediasById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id/image', function (req, res, next) {
    Problem.getImageById(req.params.id).then(result => res.send(result))
});

router.get('/problem/:id', function (req, res, next) {
    Problem.getFullById(req.params.id).then(result => res.json(result))
});

router.get('/', function (req, res, next) {
    res.send("Index on '/index'")
});

router.post('/problem', isAuthenticated, function (req, res) {
    Problem.new(req.body)
        .then((result) => result
            ? Problem.getFullById(result)
                .then(result => res.status(201).send(JSON.stringify(result)))
            : res.status(400).send())
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while creating the Problem. The problem might or might not have been created.")
        })
});

router.patch('/problem/:id', isAuthenticated, function (req, res) {
    Problem.edit(req.params.id, req.body)
        .then((result) => result ? res.status(204).send() : res.status(400).send())
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while editing the Problem. The problem might or might not have been edited.")
        })
});

router.delete('/problem/:id', isAuthenticated, function (req, res) {
    Problem.deleteWithProtection(req.params.id)
        .then((result => res.status(204).send()))
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while deleting the Problem. The problem might or might not have been deleted.")
        })
});

router.put('/problem/:id/tag', isAuthenticated, function (req, res) {
    Problem.tagger(req.params.id, req.body)
        .then(result => res.status(200).send(result))
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while tagging the Problem. The problem might or might not have been tagged.")
        })
});

router.delete('/problem/:id/tag/:tag', isAuthenticated, function (req, res) {
    Problem.deleteTag(req.params.id, req.params.tag)
        .then(result => result ? res.status(204).send() : res.status(404).send())
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal error while untagging the Problem. The problem might or might not have been untagged.")
        })
});

module.exports = router;
