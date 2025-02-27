require('dotenv').config();
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

// 데이터베이스 초기화 (DB 생성)
const { initializeDatabase } = require('./database/db');

// Sequelize 모델 연결 (DB 스키마 동기화)
const db = require('./models'); // index.js에서 sequelize 인스턴스 export
const { sequelize } = db;

// 라우트
const bakeryRoutes = require('./routes/bakeryRoutes');
const userRoutes = require('./routes/userRoutes');

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 8080;

// 미들웨어 등록
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretKey',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// DB 초기화 (없으면 DB 생성)
initializeDatabase()
  .then(() => {
    // Sequelize 모델 스키마 동기화
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database initialized and Sequelize models synced.');
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
  });

// MySQL Pool (직접 쿼리 시 사용 가능)
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydb',
  multipleStatements: true
});

// -- 간단 테스트 라우트
app.get('/api', (req, res) => {
  res.send("welcome");
});

// -- 로그인 라우트 (직접 MySQL 쿼리 예시)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await dbPool.query(
      'SELECT * FROM Users WHERE user_name = ? AND user_password = ?',
      [username, password]
    );
    if (rows.length > 0) {
      const user = rows[0];
      res.json({ user_id: user.user_id });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -- 신규 프로젝트 라우트
app.use('/api/bakeries', bakeryRoutes);
app.use('/api/users', userRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});