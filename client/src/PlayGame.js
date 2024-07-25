import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayGame.css';

const apiUrl = `http://${process.env.REACT_APP_API_URL}`;

function PlayGame() {
  const { id } = useParams();
  const [gameName, setGameName] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    async function fetchGameName() {
      try {
        const response = await fetch(`${apiUrl}/boardgames`);
        const data = await response.json();
        const game = data.find(g => g.id == id);
        if (game) {
          setGameName(game.name);
        } else {
          setGameName('Game not found');
        }
      } catch (error) {
        setGameName('Error fetching game name');
      }
    }

    fetchGameName();
  }, [id]);

  const playGame = async () => {
    const funRating = document.querySelector('input[name="rating"]:checked').value;

    try {
      const response = await fetch(`${apiUrl}/boardgames/${id}/play`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fun_rating: funRating })
      });
      if (response.ok) {
        const result = await response.json();
        setResult('Play count updated: ' + JSON.stringify(result));
      } else {
        setResult('Error: ' + response.statusText);
      }
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1><span id="gameName">{gameName}</span></h1>
      <div className="star-rating">
        <input type="radio" id="rating10" name="rating" value="10" /><label htmlFor="rating10">★</label>
        <input type="radio" id="rating9" name="rating" value="9" /><label htmlFor="rating9">★</label>
        <input type="radio" id="rating8" name="rating" value="8" /><label htmlFor="rating8">★</label>
        <input type="radio" id="rating7" name="rating" value="7" /><label htmlFor="rating7">★</label>
        <input type="radio" id="rating6" name="rating" value="6" /><label htmlFor="rating6">★</label>
        <input type="radio" id="rating5" name="rating" value="5" /><label htmlFor="rating5">★</label>
        <input type="radio" id="rating4" name="rating" value="4" /><label htmlFor="rating4">★</label>
        <input type="radio" id="rating3" name="rating" value="3" /><label htmlFor="rating3">★</label>
        <input type="radio" id="rating2" name="rating" value="2" /><label htmlFor="rating2">★</label>
        <input type="radio" id="rating1" name="rating" value="1" /><label htmlFor="rating1">★</label>
      </div>
      <button onClick={playGame}>확인</button>
      <p id="result">{result}</p>
    </div>
  );
}

export default PlayGame;
