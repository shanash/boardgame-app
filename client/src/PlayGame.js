import React from 'react';
import { useParams } from 'react-router-dom';

function PlayGame() {
  const { id } = useParams();

  // Use effect to redirect to /play?id={id}
  React.useEffect(() => {
    window.location.href = `/play?id=${id}`;
  }, [id]);

  return null; // Render nothing since we are redirecting
}

export default PlayGame;
