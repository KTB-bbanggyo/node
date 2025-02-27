const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

const initializeDatabase = async () => {
  try {
    const connection = await db.getConnection();
    //
    const initSql = fs.readFileSync(path.resolve(__dirname, '..', 'database', 'init.sql'), 'utf-8');
    const queries = initSql.split(';').filter(query => query.trim() !== '');
    for (let query of queries) {
      await connection.query(query);
    }
    //
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  db,
  initializeDatabase
};