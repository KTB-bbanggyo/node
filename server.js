require('dotenv').config();
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initializeDatabase } = require('./database/db'); // Adjust the path according to your project structure
//const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


// 초기화 실행
initializeDatabase();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

// -- test
app.get('/api', async (req, res) => {
  res.send("welcome")
});

// -- login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE user_name = ? AND user_password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        user_id: user.user_id
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});