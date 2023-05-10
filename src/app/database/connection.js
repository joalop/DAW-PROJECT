const dotenv = require('dotenv')
const path = require('path')

const mysql = require('mysql2/promise')

dotenv.config({ path: path.join(__dirname,'./.env') })

// console.log( process.env.HOST)
// console.log( process.env.USER)
// console.log( process.env.PASSWORD)
// console.log( process.env.DATABASE)

let HOST = process.env.HOST;
let USER = process.env.USER;
let PASSWORD = process.env.PASSWORD;
let DATABASE = process.env.DATABASE;

const conn = {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
};

// const conn = {
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'managebd',
// };

// Create new POOL
const pool = mysql.createPool(conn);

module.exports = pool;