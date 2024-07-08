import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [boardgames, setBoardgames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    purchase_date: ''
  });
  const [funRating, setFunRating] = useState(0);

  useEffect(() => {
    axios.get('https://boardgameapp-boardgame-app.up.railway.app/boardgames')
      .then((response) => {
        setBoardgames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame({ ...newGame, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://boardgameapp-boardgame-app.up.railway.app/boardgames', newGame)
      .then((response) => {
        setBoardgames([...boardgames, { ...newGame, id: response.data.id, play_count: 0, fun_rating: 0 }]);
        setNewGame({
          name: '',
          purchase_date: ''
        });
      })
      .catch((error) => {
        console.error('Error inserting data:', error);
      });
  };

  const handlePlay = (id) => {
    axios.put(`https://boardgameapp-boardgame-app.up.railway.app/boardgames/${id}/play`, { fun_rating: funRating })
      .then((response) => {
        const updatedBoardgames = boardgames.map((game) =>
          game.id === id ? response.data : game
        );
        setBoardgames(updatedBoardgames);
      })
      .catch((error) => {
        console.error('Error updating play count and fun rating:', error);
      });
  };

  return (
    <div>
      <h1>Boardgames</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newGame.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name="purchase_date"
          placeholder="Purchase Date"
          value={newGame.purchase_date}
          onChange={handleChange}
        />
        <button type="submit">Add Game</button>
      </form>
      <ul>
        {boardgames.map((game) => (
          <li key={game.id}>
            {game.name} - {game.purchase_date} - Plays: {game.play_count} - Fun Rating: {game.fun_rating}
            <button onClick={() => handlePlay(game.id)}>Play</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="number"
          value={funRating}
          onChange={(e) => setFunRating(e.target.value)}
          placeholder="Fun Rating"
        />
      </div>
    </div>
  );
}

export default App;
