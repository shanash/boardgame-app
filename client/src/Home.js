import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './Home.css';
import axios from 'axios';

function Home({ boardgames, handleChange, handleSubmit, newGame }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://boardgameapp-boardgame-app.up.railway.app/boardgames/${id}`);
      // After deleting, you might want to update the list of boardgames
      window.location.reload(); // or you can implement a more efficient way to update the state
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

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
        <button type="submit" className="button">Add Game</button>
      </form>
      <ul className="game-list">
        {boardgames.map(game => (
          <li key={game.id} className="game-item">
            <h2 className="game-title">{game.name || 'No name'}</h2>
            <p className="game-info">Added Date: {new Date(game.added_date).toLocaleDateString() || 'No added date'}</p>
            <p className="game-info">Play Count: {game.play_count !== undefined ? game.play_count : 'No play count'}</p>
            <p className="game-info">Average Fun Rating: {game.avg_fun_rating !== undefined ? game.avg_fun_rating : 'Not rated yet'}</p>
            <div className="qr-code">
              <QRCode value={`https://boardgameapp-boardgame-app.up.railway.app/play/${game.id}`} size={128} />
            </div>
            <Link to={`/play/${game.id}`} className="play-link">Play</Link>
            <button onClick={() => handleDelete(game.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
