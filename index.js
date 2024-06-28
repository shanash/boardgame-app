const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('database.sqlite');

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

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
