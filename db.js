const Pool = require('pg').Pool;
const secrets = require("./secrets");

const pool = new Pool({
    user: secrets.psql_user,
    host: 'localhost',
    database: 'blog_api',
    password: secrets.psql_user_password,
    port: 5432,
});

