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

console.log('DATABASE_PRIVATE_URL:', process.env.DATABASE_PRIVATE_URL);

// PostgreSQL 데이터베이스 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_PRIVATE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

pool.query(`CREATE TABLE IF NOT EXISTS boardgames (
  id SERIAL PRIMARY KEY,
  name TEXT,
  purchase_date TEXT
)`, (err, res) => {
  if (err) {
    console.error('Error creating table', err.stack);
  } else {
    console.log('Table is successfully created or already exists');
  }
});

pool.query(`CREATE TABLE IF NOT EXISTS fun_ratings (
  id SERIAL PRIMARY KEY,
  boardgame_id INTEGER REFERENCES boardgames(id),
  rating INTEGER
)`, (err, res) => {
  if (err) {
    console.error('Error creating table', err.stack);
  } else {
    console.log('Table fun_ratings is successfully created or already exists');
  }
});

app.get('/boardgames', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boardgames');
    const boardgames = result.rows;

    for (let game of boardgames) {
      const playCountResult = await pool.query('SELECT COUNT(*) as play_count FROM fun_ratings WHERE boardgame_id = $1', [game.id]);
      const ratingsResult = await pool.query('SELECT AVG(rating) as avg_rating FROM fun_ratings WHERE boardgame_id = $1', [game.id]);
      game.play_count = parseInt(playCountResult.rows[0].play_count, 10);
      game.avg_fun_rating = parseFloat(ratingsResult.rows[0].avg_rating).toFixed(2) || 'Not rated yet';
    }

    console.log('Returning boardgames:', boardgames);
    res.json(boardgames);
  } catch (err) {
    console.error('Error fetching boardgames:', err.message);
    res.status(500).send(err.message);
  }
});

app.post('/boardgames', async (req, res) => {
  const { name, purchase_date } = req.body;
  console.log('Received data:', req.body);
  try {
    const result = await pool.query(
      'INSERT INTO boardgames (name, purchase_date) VALUES ($1, $2) RETURNING id',
      [name, purchase_date]
    );
    console.log('Inserted data:', result.rows[0]);

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error inserting data', err.stack);
    res.status(500).send(err.message);
  }
});

app.put('/boardgames/:id/play', async (req, res) => {
  const { id } = req.params;
  const { fun_rating } = req.body;
  try {
    await pool.query(
      'INSERT INTO fun_ratings (boardgame_id, rating) VALUES ($1, $2)',
      [id, fun_rating]
    );

    const playCountResult = await pool.query('SELECT COUNT(*) as play_count FROM fun_ratings WHERE boardgame_id = $1', [id]);
    const ratingsResult = await pool.query('SELECT AVG(rating) as avg_rating FROM fun_ratings WHERE boardgame_id = $1', [id]);

    const updatedGame = {
      id: id,
      play_count: parseInt(playCountResult.rows[0].play_count, 10),
      avg_fun_rating: parseFloat(ratingsResult.rows[0].avg_rating).toFixed(2) || 'Not rated yet'
    };

    res.json(updatedGame);
  } catch (err) {
    console.error('Error updating play count and fun rating', err.stack);
    res.status(500).send(err.message);
  }
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/play', (req, res) => {
  res.sendFile(path.join(__dirname, 'play.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
