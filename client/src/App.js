import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Switch를 Routes로 변경
import axios from 'axios';
import Home from './Home';
import PlayGame from './PlayGame';

console.log('App component loaded');

function App() {
  const [boardgames, setBoardgames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    purchase_date: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching boardgames data...');
    axios.get('https://boardgameapp-boardgame-app.up.railway.app/boardgames')
      .then((response) => {
        console.log('Fetched boardgames:', response.data);
        setBoardgames(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame({ ...newGame, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting new game:', newGame);
    axios.post('https://boardgameapp-boardgame-app.up.railway.app/boardgames', newGame)
      .then((response) => {
        console.log('Added new game:', response.data);
        setBoardgames([...boardgames, { ...newGame, id: response.data.id, play_count: 0, avg_fun_rating: 'Not rated yet' }]);
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
    <Router>
      <Routes> {/* Switch를 Routes로 변경 */}
        <Route exact path="/" element={
          loading ? (
            <p>Loading...</p>
          ) : (
            <Home
              boardgames={boardgames}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              newGame={newGame}
            />
          )
        } />
        <Route path="/play/:id" element={<PlayGame />} /> {/* component를 element로 변경 */}
      </Routes>
    </Router>
  );
}

export default App;
