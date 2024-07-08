import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PlayGame() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use effect to redirect to /play?id={id}
  React.useEffect(() => {
    navigate(`/play?id=${id}`);
  }, [id, navigate]);

  return null; // Render nothing since we are redirecting
}

export default PlayGame;
