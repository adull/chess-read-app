import { Chess } from "chess.js";

// helper function to safely attempt a move
const tryMove = (chess, moveText, box, color, moveIndex) => {
  try {
    const move = chess.move(moveText, { sloppy: true });
    if (!move) {
      return {
        success: false,
        invalidBoxId: box.id,
        problemMove: moveText,
        message: `Invalid ${color} move "${moveText}" at move ${moveIndex + 1}`,
      };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      invalidBoxId: box.id,
      problemMove: moveText,
      message: `Error parsing ${color} move "${moveText}" at move ${moveIndex + 1}: ${err.message}`,
    };
  }
};

export const isPromotionMove = (piece, targetSquare) => {
  return (
    piece.toLowerCase() === 'p' &&
    (targetSquare[1] === '8' || targetSquare[1] === '1')
  );
};

export const validatePosition = (boxes) => {
  const chess = new Chess();

  // group into triples: [index, white, black]
  const moves = [];
  for (let i = 0; i < boxes.length; i += 3) {
    const moveNum = boxes[i];
    const whiteBox = boxes[i + 1];
    const blackBox = boxes[i + 2];
    if (!moveNum) continue;
    moves.push({ moveNum, whiteBox, blackBox });
  }

  for (let i = 0; i < moves.length; i++) {
    const { whiteBox, blackBox } = moves[i];

    if (whiteBox?.text) {
        console.log({t: whiteBox.text})
      const result = tryMove(chess, whiteBox.text, whiteBox, "white", i);
      if (!result.success) {
        return { ...result, partialPGN: chess.pgn() };
      }
    }

    if (blackBox?.text) {
      const result = tryMove(chess, blackBox.text, blackBox, "black", i);
      if (!result.success) {
        return { ...result, partialPGN: chess.pgn() };
      }
    }
  }

  return { success: true, fullPGN: chess.pgn() };
};
