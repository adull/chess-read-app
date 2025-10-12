import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const INIT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const ChessBoard = ({ pgn, onPieceDrop: externalOnPieceDrop, showMoveHistory = true }) => {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(INIT_FEN);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [startFen, setStartFen] = useState('start');

  const chessGame = gameRef.current

  // Generate square styles programmatically - much cleaner than hardcoding
  // const getSquareStyles = () => {
  //   const styles = {};
  //   const lightColor = '#ffffff';
  //   const darkColor = '#000000';
  //   
  //   // Generate all 64 squares using a simple loop
  //   for (let file = 0; file < 8; file++) {
  //     for (let rank = 0; rank < 8; rank++) {
  //       const square = String.fromCharCode(97 + file) + (8 - rank);
  //       const isLight = (file + rank) % 2 === 0;
  //       styles[square] = {
  //         backgroundColor: isLight ? lightColor : darkColor
  //       };
  //     }
  //   }
  //   
  //   // console.log({ styles })
  //   return styles;
  // };


  useEffect(() => {
    if (!pgn) return;

    try {
      const parsed = new Chess();
      parsed.loadPgn(pgn);
      const headers = parsed.header ? parsed.header() : {};
      const initialFen = headers?.SetUp === '1' && headers?.FEN ? headers.FEN : 'start';
      console.log({ initialFen})

      setStartFen(initialFen);
      const history = parsed.history();
      setMoveHistory(history);

      // Initialize board to end position by default
      const endGame = initialFen === 'start' ? new Chess() : new Chess(initialFen);
      for (const san of history) {
        endGame.move(san);
      }
      gameRef.current = endGame
      console.log({ g: gameRef.current})
      console.log({ moveHistory: history})
      setFen(gameRef.current.fen())
      // setCurrentMoveIndex());
    } catch (error) {
      console.error('Error loading PGN:', error);
    }
  }, [pgn]);

  // const onSquareClick = (square) => {
  //   console.log({ square })
  // };

  const goToMove = useCallback((moveIndex) => {
    console.log(`go to move ${moveIndex}`)
    if (moveIndex < -1 || moveIndex >= moveHistory.length) return;

    try {
      const base = startFen === 'start' ? new Chess() : new Chess(startFen);

      if (moveIndex >= 0) {
        for (let i = 0; i <= moveIndex; i++) {
          base.move(moveHistory[i]);
        }
      }

      gameRef.current = base;
      setFen(base.fen());
      setCurrentMoveIndex(moveIndex);
    } catch (error) {
      console.error('Error navigating to move:', error);
    }
  }, [moveHistory, startFen]);

  const goToStart = useCallback(() => goToMove(-1), [goToMove]);
  const goToEnd = useCallback(() => goToMove(moveHistory.length - 1), [goToMove, moveHistory.length]);
  const goToPrevious = useCallback(() => goToMove(currentMoveIndex - 1), [goToMove, currentMoveIndex]);
  const goToNext = useCallback(() => goToMove(currentMoveIndex + 1), [goToMove, currentMoveIndex]);

  // Keyboard navigation: Left/Right arrows
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToStart();
      } else if (e.key === 'End') {
        e.preventDefault();
        goToEnd();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToPrevious, goToNext, goToStart, goToEnd]);

  if (!pgn) {
    return (
      <div className="text-center text-gray-500 py-8 font-roboto">
        No PGN data available. Please upload an image to analyze.
      </div>
    );
  }



    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves`
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      // pick a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // make the move
      chessGame.move(randomMove);

      // update the position state
      setFen(chessGame.fen());
    }

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }) {
      // If external onPieceDrop is provided, use it instead
      if (externalOnPieceDrop) {
        return externalOnPieceDrop(sourceSquare, targetSquare);
      }

      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move according to chess.js logic
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state upon successful move to trigger a re-render of the chessboard
        setFen(chessGame.fen());

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: fen,
      onPieceDrop,
      // customSquareStyles: getSquareStyles(),
      id: 'play-vs-random'
    };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-center font-roboto">Chess Game Analysis</h3>
        
        {/* Chess Board */}
        <div className="flex justify-center mb-6">
          <div className="w-96 h-96 chess-board-container">
          <Chessboard
            options={chessboardOptions}
          />

          </div>
        </div>

        {showMoveHistory && (
          <>
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

            {/* Slider Navigation */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-600 font-roboto w-14 text-right">
                {currentMoveIndex + 1}/{moveHistory.length}
              </span>
              <input
                type="range"
                min={0}
                max={moveHistory.length}
                value={currentMoveIndex + 1}
                onChange={(e) => goToMove(Number(e.target.value) - 1)}
                className="flex-1"
              />
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
          </>
        )}

        {/* Game Status */}
        <div className="mt-4 text-center text-sm text-gray-600 font-roboto">
          {gameRef.current.isGameOver() ? (
            <span className="font-semibold">
              Game Over - {gameRef.current.isCheckmate() ? 'Checkmate' : 'Draw'}
            </span>
          ) : (
            <span>
              {gameRef.current.turn() === 'w' ? 'White' : 'Black'} to move
              {gameRef.current.isCheck() && ' (Check)'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
