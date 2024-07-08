import React from 'react';
import { useParams } from 'react-router-dom';

function PlayGame() {
  const { id } = useParams();

  // Use effect to redirect to play.html
  React.useEffect(() => {
    window.location.href = `/play.html?id=${id}`;
  }, [id]);

  return null; // Render nothing since we are redirecting
}

export default PlayGame;
