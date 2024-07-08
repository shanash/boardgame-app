const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

// 환경 변수 값 로그 출력
console.log('DATABASE_PRIVATE_URL:', process.env.DATABASE_PRIVATE_URL);

// PostgreSQL 데이터베이스 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_PRIVATE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 데이터베이스 연결 시도 로그 추가
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

// 데이터베이스 초기화
pool.query(`CREATE TABLE IF NOT EXISTS boardgames (
  id SERIAL PRIMARY KEY,
  name TEXT,
  purchase_date TEXT,
  play_count INTEGER DEFAULT 0,
  fun_rating INTEGER DEFAULT 0
)`, (err, res) => {
  if (err) {
    console.error('Error creating table', err.stack);
  } else {
    console.log('Table is successfully created or already exists');
  }
});

app.get('/boardgames', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boardgames');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/boardgames', async (req, res) => {
  const { name, purchase_date } = req.body;
  console.log('Received data:', req.body); // 입력 데이터 로그 출력
  try {
    const result = await pool.query(
      'INSERT INTO boardgames (name, purchase_date) VALUES ($1, $2) RETURNING id',
      [name, purchase_date]
    );
    console.log('Inserted data:', result.rows[0]); // 삽입된 데이터 로그 출력

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error inserting data', err.stack);
    res.status(500).send(err.message);
  }
});

// 특정 보드게임의 플레이 횟수 증가 및 경험 점수 업데이트
app.put('/boardgames/:id/play', async (req, res) => {
  const { id } = req.params;
  const { fun_rating } = req.body;
  try {
    // 플레이 횟수 증가
    const result = await pool.query(
      'UPDATE boardgames SET play_count = play_count + 1, fun_rating = $1 WHERE id = $2 RETURNING *',
      [fun_rating, id]
    );
    if (result.rows.length === 0) {
      res.status(404).send('Boardgame not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating play count and fun rating', err.stack);
    res.status(500).send(err.message);
  }
});

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'client/build')));

// play.html 파일 서빙 추가
app.get('/play', (req, res) => {
  res.sendFile(path.join(__dirname, 'play.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
