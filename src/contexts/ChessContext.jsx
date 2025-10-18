import { Chess } from "chess.js";
import { useState, createContext } from 'react'
import { tryMove, handlePartialPGNResult } from "../helpers";
import { useSidebar } from "../components/sidebar/SidebarManager";
import { useModal } from "../hooks/useModal";

export const ChessContext = createContext();

export const ChessProvider = ({ children }) => {
    const { addPanel } = useSidebar()
    const { openModal } = useModal()
    const [boxes, setBoxes] = useState([]);
    const [derived, setDerived] = useState({ pgn: "", moves: [], validationErrors: [] });

    const parseAndValidate = () => {
        const parsedMoves = parseMoves(boxes);
        console.log({ parsedMoves})
        const result = validateMoves(boxes, parsedMoves);
        console.log({ result })
        

        setBoxes(result.boxes);
        setDerived(result.derived);

        if (!result.success && result.pgn) {
            handlePartialPGNResult(result, addPanel, openModal);
          }
    }

    const updateBox = (id, updates) => {
        setBoxes(prev => prev.map(box => (box.id === id ? { ...box, ...updates } : box)))
    }

    const parseMoves = (boxes) => {
        // group into triples: [index, white, black]
        const moves = [];
        for (let i = 0; i < boxes.length; i += 3) {
            const moveNum = boxes[i];
            const whiteBox = boxes[i + 1];
            const blackBox = boxes[i + 2];
            if (!moveNum) continue;
            moves.push({ moveNum, whiteBox, blackBox });
        }
        return moves
    }

    const validateMoves = (boxes, parsedMoves) => {
        const chess = new Chess();
        let invalidFound = false;
        const updatedBoxes = [...boxes]; // shallow copy so we can annotate validity
      
        const markBox = (box, validity, error = null) => {
          if (!box) return;
          box.validity = validity;
          box.error = error;
        };
      
        const attemptMove = (box, color, pairIndex) => {
          if (!box?.text) return;
          if (invalidFound) {
            markBox(box, 'unreached');
            return;
          }
      
          const result = tryMove(chess, box.text, box, color, pairIndex);
          if (result.success) {
            markBox(box, 'valid');
          } else {
            invalidFound = true;
            markBox(box, 'invalid', result.error);
          }
        };
      
        for (let i = 0; i < parsedMoves.length; i++) {
          const { whiteBox, blackBox } = parsedMoves[i];
      
          attemptMove(whiteBox, 'white', i);
          attemptMove(blackBox, 'black', i);
      
          if (invalidFound) break; // stop evaluating once invalid
        }
      
        // After finding invalid, mark all remaining boxes as unreached
        if (invalidFound) {
          for (let j = 0; j < parsedMoves.length; j++) {
            const { whiteBox, blackBox } = parsedMoves[j];
            [whiteBox, blackBox].forEach((box) => {
              if (box && !box.validity) markBox(box, 'unreached');
            });
          }
        } else {
          // All valid moves should have a status
          for (let j = 0; j < parsedMoves.length; j++) {
            const { whiteBox, blackBox } = parsedMoves[j];
            [whiteBox, blackBox].forEach((box) => {
              if (box && !box.validity) markBox(box, 'valid');
            });
          }
        }
      
        return {
          success: !invalidFound,
          boxes: updatedBoxes,
          pgn: chess.pgn(),
          problemBox: updatedBoxes.find(b => b.validity === 'invalid') || null,
        };
      };
      
      

    return (
        <ChessContext.Provider value={{boxes, setBoxes, derived, updateBox, parseAndValidate }}>
            {children}
        </ChessContext.Provider>
    )
    
}