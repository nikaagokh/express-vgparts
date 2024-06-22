import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
/*
export const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    database:process.env.MYSQL_DATABASE,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD
}).promise();
*/
export const pool = mysql.createPool({
    host:'roundhouse.proxy.rlwy.net',
    database:'railway',
    user:'root',
    password:'bhbEsyQrKgegxUEQRwZpkmLbPqgvlEMM'
}).promise();