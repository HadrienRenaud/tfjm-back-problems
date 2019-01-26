const dbConfig = require('../config.js');

const knex = require('knex')(dbConfig.db);

module.exports = {knex};