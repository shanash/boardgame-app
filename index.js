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
app.get('/boardgames', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM boardgames');
      res.json(result.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

app.post('/boardgames', async (req, res) => {
    const { name, purchase_date, play_count, fun_rating, sold_date } = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO boardgames (name, purchase_date, play_count, fun_rating, sold_date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, purchase_date, play_count, fun_rating, sold_date]
        );
        res.json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 통계 API 엔드포인트 추가
app.get('/boardgames/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT AVG(fun_rating) as avg_rating, SUM(play_count) as total_plays FROM boardgames');
        res.json(result.rows);
      } catch (err) {
        res.status(500).send(err.message);
      }
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
