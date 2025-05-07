// db.js
const mysql = require("mysql2");
const dotENV = require('dotenv')

dotENV.config();


const host = process.env.host;
const port = process.env.DBPORT;
const user = process.env.DBUSER;
const password = process.env.DBPass;
const database = process.env.DBNAME;

// const db = mysql.createConnection({
//   host: 'localhost',
//   port:3306,
//   user: 'kalyan',
//   password: "Kalyan9640821039#",
//   database: "tntra"
// });

const db = mysql.createConnection({
  host: host,
  port:port,
  user: user,
  password: password,
  database: database,
  multipleStatements: true // ✅ REQUIRED
});

module.exports = db;