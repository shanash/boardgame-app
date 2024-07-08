import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

function PlayGame() {
  const { id } = useParams();
  const history = useHistory();
  const [funRating, setFunRating] = useState(0);

  const handlePlay = () => {
    axios.put(`https://boardgameapp-boardgame-app.up.railway.app/boardgames/${id}/play`, { fun_rating: funRating })
      .then((response) => {
        console.log('Updated game:', response.data);
        history.push('/');
      })
      .catch((error) => {
        console.error('Error updating play count and fun rating:', error);
      });
  };

  return (
    <div>
      <h1>Play Game</h1>
      <input
        type="number"
        value={funRating}
        onChange={(e) => setFunRating(e.target.value)}
        placeholder="Fun Rating"
      />
      <button onClick={handlePlay}>Play</button>
    </div>
  );
}

export default PlayGame;
