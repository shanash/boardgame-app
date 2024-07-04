const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// PostgreSQL 데이터베이스 연결
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

// 데이터베이스 초기화
pool.query(`CREATE TABLE IF NOT EXISTS boardgames (
    id SERIAL PRIMARY KEY,
    name TEXT,
    purchase_date TEXT,
    play_count INTEGER,
    fun_rating INTEGER,
    sold_date TEXT
  )`);

// API 엔드포인트 설정
app.get('/boardgames', (req, res) => {
  db.all('SELECT * FROM boardgames', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.post('/boardgames', (req, res) => {
  const { name, purchase_date, play_count, fun_rating, sold_date } = req.body;
  db.run(
    'INSERT INTO boardgames (name, purchase_date, play_count, fun_rating, sold_date) VALUES (?, ?, ?, ?, ?)',
    [name, purchase_date, play_count, fun_rating, sold_date],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// 통계 API 엔드포인트 추가
app.get('/boardgames/stats', (req, res) => {
  db.all('SELECT AVG(fun_rating) as avg_rating, SUM(play_count) as total_plays FROM boardgames', (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(row[0]);
    }
  });
});

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
