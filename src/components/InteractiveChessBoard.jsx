import React, { useState, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const InteractiveChessBoard = ({ onMoveSelect, currentPosition, isWhiteToMove }) => {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  useEffect(() => {
    if (currentPosition) {
      try {
        chess.load(currentPosition);
        setFen(chess.fen());
      } catch (error) {
        console.error('Error loading position:', error);
        // Fallback to starting position
        chess.reset();
        setFen(chess.fen());
      }
    } else {
      chess.reset();
      setFen(chess.fen());
    }
  }, [currentPosition, chess]);

  const onSquareClick = (square) => {
    if (selectedSquare === square) {
      // Deselect if clicking the same square
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    const piece = chess.get(square);
    
    // Only allow selecting pieces of the current player
    if (piece && piece.color === (isWhiteToMove ? 'w' : 'b')) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setPossibleMoves(moves.map(move => move.to));
    } else if (selectedSquare && possibleMoves.includes(square)) {
      // Make the move
      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' // Default to queen promotion
        });
        
        if (move) {
          setFen(chess.fen());
          onMoveSelect(move.san);
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      } catch (error) {
        console.error('Invalid move:', error);
      }
    }
  };

  const getSquareStyles = () => {
    const styles = {};
    
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)'
      };
    }
    
    possibleMoves.forEach(square => {
      styles[square] = {
        backgroundColor: 'rgba(0, 255, 0, 0.4)'
      };
    });
    
    return styles;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 h-64 mb-4">
        <Chessboard
          position={fen}
          onSquareClick={onSquareClick}
          customSquareStyles={getSquareStyles()}
          boardOrientation={isWhiteToMove ? 'white' : 'black'}
        />
      </div>
      <div className="text-sm text-gray-600 text-center">
        {isWhiteToMove ? 'White to move' : 'Black to move'}
      </div>
      {selectedSquare && (
        <div className="text-xs text-gray-500 mt-2">
          Click a green square to make a move
        </div>
      )}
    </div>
  );
};

export default InteractiveChessBoard;
