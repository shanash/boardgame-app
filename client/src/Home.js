import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Modal from 'react-modal';
import './Home.css';

Modal.setAppElement('#root'); // Ensure accessibility

function Home({ boardgames, handleChange, handleSubmit, newGame }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  const openModal = (game) => {
    setGameToDelete(game);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setGameToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://boardgameapp-boardgame-app.up.railway.app/boardgames/${gameToDelete.id}`);
      // After deleting, you might want to update the list of boardgames
      window.location.reload(); // or you can implement a more efficient way to update the state
      closeModal();
    } catch (error) {
      console.error('Error deleting data:', error);
      closeModal();
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
            <button onClick={() => openModal(game)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Are you sure?</h2>
        <p>Do you really want to delete <strong>{gameToDelete?.name}</strong>?</p>
        <button onClick={handleDelete} className="button">Yes, Delete</button>
        <button onClick={closeModal} className="button">Cancel</button>
      </Modal>
    </div>
  );
}

export default Home;
