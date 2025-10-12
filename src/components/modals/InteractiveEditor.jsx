import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../ChessBoard';

const InteractiveEditor = ({ onClose, initialPgn, onMoveUpdate, invalidMoveIndex }) => {
  const [chess, setChess] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [pendingMove, setPendingMove] = useState(null);
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
  const [currentPgn, setCurrentPgn] = useState('');

  useEffect(() => {
    if (initialPgn) {
      try {
        const newChess = new Chess();
        newChess.loadPgn(initialPgn);
        setChess(newChess);
        setMoveHistory(newChess.history());
        setCurrentMoveIndex(newChess.history().length - 1);
        setCurrentPgn(initialPgn);
      } catch (error) {
        console.error('Error loading PGN:', error);
      }
    }
  }, [initialPgn]);

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Default to queen promotion
      });

      if (move) {
        setPendingMove({
          from: sourceSquare,
          to: targetSquare,
          san: move.san,
          moveIndex: currentMoveIndex + 1
        });
        setIsWaitingForConfirmation(true);
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    return false;
  };

  const confirmMove = () => {
    if (pendingMove && onMoveUpdate) {
      onMoveUpdate(pendingMove);
    }
    setPendingMove(null);
    setIsWaitingForConfirmation(false);
  };

  const cancelMove = () => {
    // Reset the board to the current position by regenerating the PGN
    const currentPgn = chess.pgn();
    setCurrentPgn(currentPgn);
    setPendingMove(null);
    setIsWaitingForConfirmation(false);
  };

  const goToMove = (index) => {
    try {
      // If index is -1, go to the initial position
      if (index === -1) {
        const initialChess = new Chess();
        // Don't load the full PGN, just get the initial position
        if (initialPgn) {
          const tempChess = new Chess();
          tempChess.loadPgn(initialPgn);
          // Get the initial FEN from the PGN headers
          const headers = tempChess.header();
          const initialFen = headers?.SetUp === '1' && headers?.FEN ? headers.FEN : 'start';
          if (initialFen !== 'start') {
            initialChess.load(initialFen);
          }
        }
        setChess(initialChess);
        setCurrentMoveIndex(-1);
        setCurrentPgn(initialChess.pgn());
        return;
      }

      // Create a new chess instance starting from the initial position
      const positionChess = new Chess();
      
      // Get the initial position from the PGN
      if (initialPgn) {
        const tempChess = new Chess();
        tempChess.loadPgn(initialPgn);
        const headers = tempChess.header();
        const initialFen = headers?.SetUp === '1' && headers?.FEN ? headers.FEN : 'start';
        if (initialFen !== 'start') {
          positionChess.load(initialFen);
        }
      }
      
      // Get all moves from the original PGN
      const tempChess = new Chess();
      tempChess.loadPgn(initialPgn);
      const allMoves = tempChess.history();
      
      // Apply moves up to the selected position
      for (let i = 0; i <= index; i++) {
        if (allMoves[i]) {
          const move = positionChess.move(allMoves[i]);
          if (!move) {
            console.error(`Failed to apply move ${i}: ${allMoves[i]}`);
            return;
          }
        }
      }
      
      // Update state
      setChess(positionChess);
      setCurrentMoveIndex(index);
      
      // Generate PGN for the current position
      const currentPgn = positionChess.pgn();
      setCurrentPgn(currentPgn);
      
    } catch (error) {
      console.error('Error navigating to move:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Interactive Move Editor
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
        {/* Moves List */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Move History</h3>
          
          {/* Start Position Button */}
          <div className="mb-4">
            <button
              onClick={() => goToMove(-1)}
              className={`w-full p-3 rounded text-left transition-colors ${
                currentMoveIndex === -1
                  ? 'bg-green-200 text-green-800 border-2 border-green-400'
                  : 'bg-white hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="font-mono font-semibold">Start Position</span>
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {moveHistory.map((move, index) => (
                <button
                  key={index}
                  onClick={() => goToMove(index)}
                  className={`p-3 rounded text-left transition-colors ${
                    index === currentMoveIndex
                      ? 'bg-blue-200 text-blue-800 border-2 border-blue-400'
                      : index === invalidMoveIndex
                      ? 'bg-red-200 text-red-800 border-2 border-red-400'
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="font-mono font-semibold">
                    {Math.floor(index / 2) + 1}. {move}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chess Board */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Chess Board</h3>
          
          {/* Move Confirmation */}
          {isWaitingForConfirmation && pendingMove && (
            <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>New Move:</strong> {pendingMove.san}
              </p>
              <p className="text-xs text-yellow-600 mb-3">
                Do you want to update the move from {/* maybe pass the bad move to here somehow? */} to <b>{pendingMove.san}</b>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmMove}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm rounded px-4 py-2 transition-colors"
                >
                  Yes, Update Move
                </button>
                <button
                  onClick={cancelMove}
                  className="bg-gray-500 hover:bg-gray-600 text-white text-sm rounded px-4 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <ChessBoard 
              pgn={currentPgn} 
              onPieceDrop={handlePieceDrop}
              showMoveHistory={false}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Instructions:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Click "Start Position" to go back to the initial position</li>
          <li>• Click on any move in the history to navigate to that position</li>
          <li>• Make moves on the chessboard to suggest corrections</li>
          <li>• Confirm the move when prompted to update the sequence</li>
          <li>• Invalid moves are highlighted in red, current position in blue</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveEditor;
