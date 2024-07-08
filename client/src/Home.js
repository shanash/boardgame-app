import React from 'react';
import { Link } from 'react-router-dom';

function Home({ boardgames, handleChange, handleSubmit, newGame }) {
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
            <Link to={`/play/${game.id}`}>Play</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
