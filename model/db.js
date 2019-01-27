const db = {
    client: "mysql",
    version: '5.7',
    connection: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'tfjmprob',
        database: process.env.MYSQL_DATABASE || 'tfjmprob',
        password: process.env.MYSQL_PASSWORD,
    }
}

const knex = require('knex')(db);

module.exports = {knex};