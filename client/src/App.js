import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import PlayGame from './PlayGame';

function App() {
  const [boardgames, setBoardgames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    purchase_date: ''
  });

  useEffect(() => {
    axios.get('https://boardgameapp-boardgame-app.up.railway.app/boardgames')
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
    axios.post('https://boardgameapp-boardgame-app.up.railway.app/boardgames', newGame)
      .then((response) => {
        setBoardgames([...boardgames, { ...newGame, id: response.data.id, play_count: 0, avg_fun_rating: 0 }]);
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
      <Switch>
        <Route exact path="/">
          <Home
            boardgames={boardgames}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            newGame={newGame}
          />
        </Route>
        <Route path="/play/:id" component={PlayGame} />
      </Switch>
    </Router>
  );
}

export default App;
