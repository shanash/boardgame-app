const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_PRIVATE_URL,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/play/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/boardgames', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boardgames');
    const boardgames = result.rows;

    // Calculate play_count and avg_fun_rating for each game
    for (let game of boardgames) {
      const playCountResult = await pool.query('SELECT COUNT(*) as play_count FROM fun_ratings WHERE boardgame_id = $1', [game.id]);
      const ratingsResult = await pool.query('SELECT AVG(rating) as avg_rating FROM fun_ratings WHERE boardgame_id = $1', [game.id]);

      game.play_count = parseInt(playCountResult.rows[0].play_count, 10);
      game.avg_fun_rating = parseFloat(ratingsResult.rows[0].avg_rating).toFixed(2) || 'Not rated yet';
    }

    res.json(boardgames);
  } catch (err) {
    console.error('Error fetching boardgames', err.stack);
    res.status(500).send(err.message);
  }
});

app.post('/boardgames', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO boardgames (name) VALUES ($1) RETURNING *', // Automatically sets added_date to current timestamp
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting boardgame', err.stack);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
