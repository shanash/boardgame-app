import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [boardgames, setBoardgames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    purchase_date: ''
  });

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
        setBoardgames([...boardgames, { ...newGame, id: response.data.id }]);
        setNewGame({
          name: '',
          purchase_date: ''
        });
      })
      .catch((error) => {
        console.error('Error inserting data:', error);
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
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
