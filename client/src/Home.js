import React from 'react';
import { Link } from 'react-router-dom';

console.log('Home component loaded'); // Home 컴포넌트 로드 확인

function Home({ boardgames, handleChange, handleSubmit, newGame }) {
  console.log('Rendering Home with boardgames:', boardgames); // 데이터 로깅

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
        {boardgames.length > 0 ? (
          boardgames.map(game => (
            <li key={game.id}>
              <h2>{game.name || 'No name'}</h2>
              <p>Purchase Date: {game.purchase_date || 'No purchase date'}</p>
              <p>Play Count: {game.play_count !== undefined ? game.play_count : 'No play count'}</p>
              <p>Average Fun Rating: {isNaN(parseFloat(game.avg_fun_rating)) ? 'Not rated yet' : game.avg_fun_rating}</p>
              <Link to={`/play/${game.id}`}>Play</Link>
            </li>
          ))
        ) : (
          <p>No boardgames available</p>
        )}
      </ul>
    </div>
  );
}

export default Home;
