import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import PlayGame from './PlayGame';
import './Home.css';
import './PlayGame.css';

const apiUrl = `http://${process.env.REACT_APP_API_URL}`;

function App() {
  const [boardgames, setBoardgames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    purchase_date: ''
  });

  useEffect(() => {
    axios.get(`${apiUrl}/boardgames`)
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
    axios.post(`${apiUrl}/boardgames`, newGame)
      .then((response) => {
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
      <Routes>
        <Route
          path="/"
          element={
            <Home
              boardgames={boardgames}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              newGame={newGame}
            />
          }
        />
        <Route path="/play/:id" element={<PlayGame />} />
      </Routes>
    </Router>
  );
}

export default App;
