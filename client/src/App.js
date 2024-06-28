import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [boardgames, setBoardgames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    purchase_date: '',
    play_count: 0,
    fun_rating: 0,
    sold_date: ''
  });

  useEffect(() => {
    axios.get('https://boardgame-app-production-4d7b.up.railway.app/boardgames').then((response) => {
      setBoardgames(response.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame({ ...newGame, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://boardgame-app-production-4d7b.up.railway.app/boardgames', newGame).then((response) => {
      setBoardgames([...boardgames, { ...newGame, id: response.data.id }]);
      setNewGame({
        name: '',
        purchase_date: '',
        play_count: 0,
        fun_rating: 0,
        sold_date: ''
      });
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
        <input
          type="number"
          name="play_count"
          placeholder="Play Count"
          value={newGame.play_count}
          onChange={handleChange}
        />
        <input
          type="number"
          name="fun_rating"
          placeholder="Fun Rating"
          value={newGame.fun_rating}
          onChange={handleChange}
        />
        <input
          type="date"
          name="sold_date"
          placeholder="Sold Date"
          value={newGame.sold_date}
          onChange={handleChange}
        />
        <button type="submit">Add Game</button>
      </form>
      <ul>
        {boardgames.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
