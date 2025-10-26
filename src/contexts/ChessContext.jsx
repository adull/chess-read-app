import { Chess } from "chess.js";
import { useCallback, useState, createContext } from 'react'
import { tryMove } from "../helpers";
import { boxesToMoves } from "../helpers";

export const ChessContext = createContext();

export const ChessProvider = ({ children }) => {
    const [boxes, setBoxes] = useState([]);
    const [moves, setMoves] = useState([]);
    const [problemBox, setproblemBox] = useState({});
    const [pgn, setPgn] = useState('');
    const [pgnIsComplete, setPgnIsComplete] = useState(false);

    const parseAndValidate = useCallback((newBoxes = boxes) => {
      // console.log({ newBoxes })
        // const parsedMoves = parseMoves(boxes);
        const moves = boxesToMoves(newBoxes)
        // console.log({ moves })
        const result = validateMoves(moves);
        // console.log({ result })
        
        // console.log({ result })
        setBoxes(result.boxes);
        setMoves(result.moves);
        setproblemBox(result.problemBox);
        setPgn(result.pgn);
        setPgnIsComplete(result.success);

        return result
    }, [boxes])

    const updateBox = (id, updates) => {
        setBoxes(prev => {
          const updated = prev.map(box => (box.id === id ? { ...box, ...updates } : box));
          parseAndValidate(updated)
          return updated;
        })
    }

    const validateMoves = (moves) => {
      const chess = new Chess();
      let invalidFound = false;
      const updatedBoxes = [];
    
      const markBox = (box, validity, error = null) => {
        if (!box) return null;
        return { ...box, validity, error };
      };
    
      for (let i = 0; i < moves.length; i++) {
        const { white, black } = moves[i];
    
        const attemptMove = (box, color) => {
          if (!box?.text) return box;
          if (invalidFound) return markBox(box, 'unreached');
    
          const result = tryMove({chess, box, color, moveIndex: i});
          if (result.success) {
            return markBox(box, 'valid');
          } else {
            invalidFound = true;
            return markBox(box, 'invalid', result.error);
          }
        };
    
        const whiteBox = attemptMove(white, 'white');
        const blackBox = attemptMove(black, 'black');
    
        updatedBoxes.push(...[whiteBox, blackBox].filter(Boolean));
        if (invalidFound) break;
      }
    
      // handle remaining boxes after an invalid move
      if (invalidFound) {
        for (let i = 0; i < moves.length; i++) {
          const { white, black } = moves[i];
          [white, black].forEach((box) => {
            if (box && !updatedBoxes.find((b) => b.id === box.id)) {
              updatedBoxes.push(markBox(box, 'unreached'));
            }
          });
        }
      } else {
        // ensure all boxes are marked valid
        for (let i = 0; i < moves.length; i++) {
          const { white, black } = moves[i];
          [white, black].forEach((box) => {
            if (box && !updatedBoxes.find((b) => b.id === box.id)) {
              updatedBoxes.push(markBox(box, 'valid'));
            }
          });
        }
      }
    
      const problemBox = updatedBoxes.find((b) => b.validity === 'invalid') || null;


      const updatedMoves = moves.map((move) => {
        const findBox = (origBox) =>
          origBox
            ? updatedBoxes.find((b) => b.id === origBox.id) || origBox
            : null;
    
        return {
          ...move,
          white: findBox(move.white),
          black: findBox(move.black),
        };
      });
    
      return {
        boxes: updatedBoxes,
        pgn: chess.pgn(),
        moves: updatedMoves,
        success: !invalidFound,
        problemBox
      };
    };
    
      
      

    return (
      <ChessContext.Provider
      value={{
        boxes,
        moves,
        problemBox,
        pgn,
        pgnIsComplete,
        setBoxes,
        updateBox,
        parseAndValidate,
      }}
    >
      {children}
    </ChessContext.Provider>
    )
    
}