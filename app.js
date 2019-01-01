const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Serve static files found
 */
app.use('/documents', express.static(path.join(__dirname, 'documents')));

app.use('/', indexRouter);

module.exports = app;
