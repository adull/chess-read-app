import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const ChessBoard = ({ pgn }) => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  // Generate square styles programmatically - much cleaner than hardcoding
  const getSquareStyles = () => {
    const styles = {};
    const lightColor = '#f0d9b5';
    const darkColor = '#b58863';
    
    // Generate all 64 squares using a simple loop
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const square = String.fromCharCode(97 + file) + (8 - rank);
        const isLight = (file + rank) % 2 === 0;
        styles[square] = {
          backgroundColor: isLight ? lightColor : darkColor
        };
      }
    }
    
    return styles;
  };


  useEffect(() => {
    if (pgn) {
      const newGame = new Chess();
      try {
        newGame.loadPgn(pgn);
        setGame(newGame);
        setMoveHistory(newGame.history());
        setCurrentMoveIndex(newGame.history().length - 1);
      } catch (error) {
        console.error('Error loading PGN:', error);
      }
    }
  }, [pgn]);

  const onSquareClick = (square) => {
    console.log({ square })
  };

  const goToMove = (moveIndex) => {
    if (moveIndex < 0 || moveIndex >= moveHistory.length) return;
    
    const newGame = new Chess();
    try {
      newGame.loadPgn(pgn);
      // Navigate to the specific move
      for (let i = 0; i <= moveIndex; i++) {
        newGame.move(moveHistory[i]);
      }
      setGame(newGame);
      setCurrentMoveIndex(moveIndex);
    } catch (error) {
      console.error('Error navigating to move:', error);
    }
  };

  const goToStart = () => goToMove(-1);
  const goToEnd = () => goToMove(moveHistory.length - 1);
  const goToPrevious = () => goToMove(currentMoveIndex - 1);
  const goToNext = () => goToMove(currentMoveIndex + 1);

  if (!pgn) {
    return (
      <div className="text-center text-gray-500 py-8 font-roboto">
        No PGN data available. Please upload an image to analyze.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-center font-roboto">Chess Game Analysis</h3>
        
        {/* Chess Board */}
        <div className="flex justify-center mb-6">
          <div className="w-96 h-96 chess-board-container">
            <Chessboard
              position={game.fen()}
              onSquareClick={onSquareClick}
              boardWidth={384}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              }}
              customSquareStyles={getSquareStyles()}
            />
          </div>
        </div>

        {/* Move Navigation Controls */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={goToStart}
            disabled={currentMoveIndex === -1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-roboto"
          >
            Start
          </button>
          <button
            onClick={goToPrevious}
            disabled={currentMoveIndex <= -1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-roboto"
          >
            Previous
          </button>
          <button
            onClick={goToNext}
            disabled={currentMoveIndex >= moveHistory.length - 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-roboto"
          >
            Next
          </button>
          <button
            onClick={goToEnd}
            disabled={currentMoveIndex === moveHistory.length - 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-roboto"
          >
            End
          </button>
        </div>

        {/* Move List */}
        <div className="max-h-40 overflow-y-auto">
          <h4 className="font-semibold mb-2 font-roboto">Moves:</h4>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {moveHistory.map((move, index) => (
              <button
                key={index}
                onClick={() => goToMove(index)}
                className={`p-2 text-left rounded font-roboto ${
                  index === currentMoveIndex
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {index + 1}. {move}
              </button>
            ))}
          </div>
        </div>

        {/* Game Status */}
        <div className="mt-4 text-center text-sm text-gray-600 font-roboto">
          {game.isGameOver() ? (
            <span className="font-semibold">
              Game Over - {game.isCheckmate() ? 'Checkmate' : 'Draw'}
            </span>
          ) : (
            <span>
              {game.turn() === 'w' ? 'White' : 'Black'} to move
              {game.isCheck() && ' (Check)'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
