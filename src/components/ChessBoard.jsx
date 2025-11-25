import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useModal } from '../hooks/useModal';
import { isPromotionMove, getSanForMove } from '../helpers';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { MoveButton } from './MoveButton';
import { useSidebar } from "./sidebar/SidebarManager";
import ReplaceMovePanel from '../components/sidebar/ReplaceMovePanel'

import PromotionChoice from './modals/PromotionChoice';

const INIT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const ChessBoard = ({ pgn, moveList, pgnIssue, onChangeMove }) => {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(INIT_FEN);
  // const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [startFen, setStartFen] = useState('start');
  const [promotionChoice, setPromotionChoice] = useState('q')
  const [visibleMoves, setVisibleMoves] = useState([])
  const { openModal, closeModal } = useModal();
  const { addPanel, findPanel } = useSidebar()

  const chessGame = gameRef.current

  useEffect(() => {
    if(pgnIssue.hasIssue) {
      // console.log(pgnIssue)
      // console.log(moveList)
      const okMoves = moveList.slice(0, pgnIssue.moveNumber)
      // console.log({ okMoves })
      const flatOkMoves = flattenMoves(okMoves)
      setVisibleMoves(okMoves)
      setCurrentMoveIndex(flatOkMoves.length - 1)
      return
    }
    console.log(moveList)
    setCurrentMoveIndex(moveList.length - 1)
    
  }, [moveList, pgnIssue])


  useEffect(() => {
    if (!pgn) return;

    try {
      const parsed = new Chess();
      parsed.loadPgn(pgn);
      const headers = parsed.header ? parsed.header() : {};
      const initialFen = headers?.SetUp === '1' && headers?.FEN ? headers.FEN : 'start';

      setStartFen(initialFen);
      const history = parsed.history();
      // setMoveHistory(history);

      // Initialize board to end position by default
      const endGame = initialFen === 'start' ? new Chess() : new Chess(initialFen);
      for (const san of history) {
        endGame.move(san);
      }
      gameRef.current = endGame
      setFen(gameRef.current.fen())
      // setCurrentMoveIndex());
    } catch (error) {
      console.error('Error loading PGN:', error);
    }
  }, [pgn]);

  const askToUpdateMove = (before, now, moveNumber, color) => {
    const onReplaceMove = () => {
      onChangeMove({
        moveNumber,
        type: color,
        text: now,
      });
    }
    addPanel('replace-move-panel', ReplaceMovePanel, { before, now, onReplaceMove })
  }

  // const onSquareClick = (square) => {
  //   console.log({ square })
  // };

  const flattenMoves = (moveList) => {
    const arr = [];
  
    for (const m of moveList) {
      if (m.white) arr.push(m.white);
      if (m.black) arr.push(m.black);
    }
  
    return arr;
  };

  const goToMove = useCallback((moveIndex) => {
    let actualMove = 0
    const moves = flattenMoves(moveList).slice(0,moveIndex + 1)
    try {
      const base = startFen === 'start' ? new Chess() : new Chess(startFen);

      if (moveIndex >= 0) {
        for (let i = 0; i <= moves.length - 1; i++) {
          try {
            base.move(moves[i], {sloppy: true });
            actualMove++
          } catch(e) {
            // if(i > 0) base.move(moves[i - 1], {sloppy: true });

          }
        }
      }

      gameRef.current = base;
      setFen(base.fen());
      setCurrentMoveIndex(actualMove);
    } catch (error) {
      console.error('Error navigating to move:', error);
    }
  }, [startFen]);

  // this needs to update the game
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }) {
      const movePiece = chessGame.get(sourceSquare);
      console.log({currentMoveIndex})
      const flatMoveList = flattenMoves(moveList)
      const currentMove = flatMoveList[currentMoveIndex]
      console.log({ currentMove })
      const color = movePiece.color === 'b' ? 'black' : 'white'

      console.log(movePiece, sourceSquare, targetSquare )

      const san = getSanForMove(chessGame, {from: sourceSquare, to: targetSquare})
      console.log({ san })
      askToUpdateMove(currentMove, san, Math.floor(currentMoveIndex / 2) + 1, color)


      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // if (isPromotionMove(movePiece.type, targetSquare)) {
      //   let modalId;
      
      //   const choosePiece = (choice) => {
      //     console.log({ choice })
      //     setPromotionChoice(choice);
      //     closeModal(modalId);
      //   };
      
      //   modalId = openModal(PromotionChoice, 'promotion-choice', { color: movePiece.color, choosePiece });
      // }
      // try to make the move according to chess.js logig
      try {
        // const move = chessGame.move({
        //   from: sourceSquare,
        //   to: targetSquare,
        //   promotion: promotionChoice
        // });


        // update the position state upon successful move to trigger a re-render of the chessboard
        // setFen(chessGame.fen());

        // make random cpu move after a short delay
        // setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

  const goToStart = useCallback(() => goToMove(-1), [goToMove]);
  const goToEnd = useCallback(() => goToMove(moveList.length - 1), [goToMove, moveList.length]);
  const goToPrevious = useCallback(() => goToMove(currentMoveIndex - 1), [goToMove, currentMoveIndex]);
  const goToNext = useCallback(() => goToMove(currentMoveIndex + 1), [goToMove, currentMoveIndex]);

  

  if (!pgn) {
    return (
      <div className="text-center text-gray-500 py-8 font-roboto">
        No PGN data available. Please upload an image to analyze.
      </div>
    );
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

        {moveList.length > 0 && (
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
                disabled={currentMoveIndex >= moveList.length - 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-roboto"
              >
                Next
              </button>
              <button
                onClick={goToEnd}
                disabled={currentMoveIndex === moveList.length - 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 font-roboto"
              >
                End
              </button>
            </div>

            {/* Slider Navigation */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-600 font-roboto w-14 text-right">
                {Math.floor(currentMoveIndex / 2) + 1 + ` ` + currentMoveIndex % 2 === 0 ? 'w' : 'b'}/{Math.ceil(moveList.length / 2)}
              </span>
              <input
                type="range"
                min={0}
                max={moveList.length}
                value={currentMoveIndex + 1}
                onChange={(e) => goToMove(Number(e.target.value) - 1)}
                className="flex-1"
              />
            </div>

            <div className="max-h-40 overflow-y-auto">
              <h4 className="font-semibold mb-2 font-roboto">Moves:</h4>

              <div className="grid grid-cols-2 gap-1 text-sm">
                {visibleMoves.map((move, index) => (
                  <React.Fragment key={index}>

                    <MoveButton
                      active={currentMoveIndex === index}
                      onClick={() => goToMove(index * 2)}
                    >
                      {move.moveNumber}. {move.white}
                    </MoveButton>

                    <MoveButton
                      move={move}
                      
                      onClick={() => goToMove(index * 2 + 1)}
                    >
                      {move.black}
                    </MoveButton>

                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
