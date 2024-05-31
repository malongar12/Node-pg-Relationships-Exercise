/** Database setup for BizTime. */


const Pool = require("pg").Pool



const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "biztime",
    password: "malongar12",
    port: 5432,

});

module.exports = pool
