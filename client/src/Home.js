import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './Home.css';

function Home({ boardgames, handleChange, handleSubmit, newGame }) {
  return (
    <div className="container">
      <h1>Boardgames List</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newGame.name}
          onChange={handleChange}
          className="input"
        />
        <input
          type="date"
          name="purchase_date"
          placeholder="Purchase Date"
          value={newGame.purchase_date}
          onChange={handleChange}
          className="input"
        />
        <button type="submit" className="button">Add Game</button>
      </form>
      <ul className="game-list">
        {boardgames.map(game => (
          <li key={game.id} className="game-item">
            <h2 className="game-title">{game.name || 'No name'}</h2>
            <p className="game-info">Purchase Date: {game.purchase_date || 'No purchase date'}</p>
            <p className="game-info">Play Count: {game.play_count !== undefined ? game.play_count : 'No play count'}</p>
            <p className="game-info">Average Fun Rating: {game.avg_fun_rating !== undefined ? game.avg_fun_rating : 'Not rated yet'}</p>
            <Link to={`/play/${game.id}`} className="play-link">Play</Link>
            <div className="qr-code">
              <QRCode value={`https://boardgameapp-boardgame-app.up.railway.app/play/${game.id}`} size={128} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
