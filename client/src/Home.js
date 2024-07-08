import React from 'react';
import { Link } from 'react-router-dom';

function Home({ boardgames, handleChange, handleSubmit, newGame }) {
  return (
    <div>
      <h1>Boardgames List</h1>
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
        {boardgames.map(game => (
          <li key={game.id}>
            <h2>{game.name}</h2>
            <p>Purchase Date: {game.purchase_date}</p>
            <p>Play Count: {game.play_count}</p>
            <p>Average Fun Rating: {game.avg_fun_rating || 'Not rated yet'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
