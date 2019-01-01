var express = require('express');
var path = require('path');
var config = require('./config.js');

var indexRouter = require('./routes/index');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Serve static files found
 */
app.use('/documents', express.static(path.join(__dirname, 'documents')));

app.use('/', indexRouter);

module.exports = app;
