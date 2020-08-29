const mysql = require('mysql');

const connect = () => {
    const pool = mysql.createPool({

        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_NAME

    });

    global.db = pool;

}

module.exports = { connect };