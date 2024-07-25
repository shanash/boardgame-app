import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { PDFDocument, rgb } from 'pdf-lib';
import QRCodeLib from 'qrcode';
import fontkit from '@pdf-lib/fontkit';
import Modal from 'react-modal';
import './Home.css';

Modal.setAppElement('#root'); // Ensure accessibility

const apiUrl = `${process.env.REACT_APP_API_URL}`;

function Home({ boardgames, handleChange, handleSubmit, newGame }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [warningModalIsOpen, setWarningModalIsOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  const openModal = (game) => {
    setGameToDelete(game);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setGameToDelete(null);
  };

  const openWarningModal = () => {
    setWarningModalIsOpen(true);
  };

  const closeWarningModal = () => {
    setWarningModalIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/boardgames/${gameToDelete.id}`);
      window.location.reload(); // or you can implement a more efficient way to update the state
      closeModal();
    } catch (error) {
      console.error('Error deleting data:', error);
      closeModal();
    }
  };

  const loadFont = async (url) => {
    const response = await fetch(url);
    const base64 = await response.text();
    return base64;
  };

  const generateQRCode = (text, options) => {
    return new Promise((resolve, reject) => {
      QRCodeLib.toDataURL(text, options, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontUrl = '/fonts/NotoSansCJK-Regular.base64.txt'; // Adjust the path to your font file
    const base64Font = await loadFont(fontUrl);
    const fontBytes = Uint8Array.from(atob(base64Font), c => c.charCodeAt(0));

    const customFont = await pdfDoc.embedFont(fontBytes);
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const fontSize = 12;

    page.setFont(customFont);
    page.setFontSize(fontSize);

    const margin = 20;
    const qrSize = 80;
    const numCols = 3;
    const numRows = Math.floor((height - margin * 2) / (qrSize + 40));

    for (let index = 0; index < boardgames.length; index++) {
      const game = boardgames[index];
      const col = index % numCols;
      const row = Math.floor(index / numCols) % numRows;
      const x = margin + col * ((width - margin * 2) / numCols);
      const y = height - margin - (row + 1) * (qrSize + 40);

      page.drawText(game.name, {
        x: x,
        y: y + qrSize + 15,
        size: fontSize,
        color: rgb(0, 0, 0),
        maxWidth: qrSize
      });

      const qrCodeDataUrl = await generateQRCode(`${apiUrl}/play/${game.id}`, { width: qrSize, margin: 1 });

      const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
      page.drawImage(qrImage, {
        x: x,
        y: y,
        width: qrSize,
        height: qrSize
      });

      if (index === boardgames.length - 1) {
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'boardgames_qr_codes.pdf';
        link.click();
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newGame.name.trim()) {
      openWarningModal();
      return;
    }
    handleSubmit(e); // This will only be called if the name is not empty
  };

  return (
    <div className="container">
      <h1>Boardgames List</h1>
      <form onSubmit={handleFormSubmit} className="form">
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
      <button onClick={generatePDF} className="button">Download QR Codes as PDF</button>
      <ul className="game-list">
        {boardgames.map(game => (
          <li key={game.id} className="game-item">
            <h2 className="game-title">{game.name || 'No name'}</h2>
            <p className="game-info">Added Date: {new Date(game.added_date).toLocaleDateString() || 'No added date'}</p>
            {game.play_count > 0 && (
              <>
                <p className="game-info">Play Count: {game.play_count}</p>
                <p className="game-info">Average Fun Rating: {game.avg_fun_rating}</p>
              </>
            )}
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
      <Modal
        isOpen={warningModalIsOpen}
        onRequestClose={closeWarningModal}
        contentLabel="Warning"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Warning</h2>
        <p>Please enter a game name.</p>
        <button onClick={closeWarningModal} className="button">OK</button>
      </Modal>
    </div>
  );
}

export default Home;
