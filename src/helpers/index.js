import { Chess } from "chess.js";
import { v4 as uuidv4 } from "uuid"

// helper function to safely attempt a move
export const tryMove = (chess, moveText, box, color, moveIndex) => {
  try {
    const move = chess.move(moveText, { sloppy: true });
    if (!move) {
      console.log({ moveText, box, color, moveIndex })
      return {
        success: false,
        problemBox: box,
        error: `Invalid ${color} move "${moveText}" at move ${moveIndex + 1}`,
      };
    }
    return { success: true };
  } catch (err) {
    console.log(`THIS IS IN THE CATCH ERR `)
    console.log({ err})
    console.log({ moveText, box, color, moveIndex })
    return {
      success: false,
      problemBox: box,
      error: `Error parsing ${color} move "${moveText}" at move ${moveIndex + 1}: ${err.message}`,
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

export const handlePartialPGNResult = (result) => {
  console.log(result)
  const chess = new Chess();

  // Load whatever PGN we have
  if (result.pgn) {
    chess.loadPgn(result.pgn);
  }

  // Derive moves and attach validity
  const moves = chess.history();
  console.log({ chess, moves })
  const movesWithValidity = moves.map(move => ({
    move,
    isValid: true
  }));

  // Append the problem move (the one that failed validation)
  if (result.derived.problemBox) {
    movesWithValidity.push({
      move: result.problemBox.text || result.problemBox.move || '[invalid]',
      isValid: false
    });
  }
  // console.log({ movesWithValidity})
  return movesWithValidity

}

export const setupBoxesWithCheatMoves = (moves, setBoxes) => {
    // layout configuration
    const startTop = 26; // moved down slightly
    const endBottom = 90; // stop ~5% from bottom
    const numMoves = moves.length;
    const totalSpan = endBottom - startTop;
    const rowGap = totalSpan / (numMoves - 1);

    const numCol = 8; // move numbers
    const whiteCol = 20; // white moves
    const blackCol = 58; // black moves
    const boxW = 8;
    const boxH = 3;

    const boxes = moves.flatMap((pair, i) => {
      const [white, black] = pair;
      const y = startTop + i * rowGap;
      const moveNum = `${i + 1}.`;

      const rowBoxes = [
        {
          id: uuidv4(),
          text: moveNum,
          top: y,
          left: numCol,
          width: 4,
          height: boxH,
          meta: {
            type: "index",
            moveNumber: moveNum
          }
        },
      ];

      if (white) {
        rowBoxes.push({
          id: uuidv4(),
          text: white,
          top: y,
          left: whiteCol,
          width: boxW,
          height: boxH,
          meta: {
            type: "white",
            moveNumber: moveNum
          }
        });
      }

      if (black) {
        rowBoxes.push({
          id: uuidv4(),
          text: black,
          top: y,
          left: blackCol,
          width: boxW,
          height: boxH,
          meta: {
            type: "black",
            moveNumber: moveNum
          }
        });
      }

      

      return rowBoxes;
    });

    setBoxes(boxes);
    return boxes;
}

export const boxesToMoves = (boxes) => {
  const movesMap = new Map();

  for (const box of boxes) {
    const meta = box.meta;
    if (!meta || meta.type === "index" || !meta.moveNumber) continue;

    const moveNum = meta.moveNumber;
    if (!movesMap.has(moveNum)) {
      movesMap.set(moveNum, { moveNumber: moveNum });
    }

    const move = movesMap.get(moveNum);
    if (meta.type === "white") move.white = box;
    if (meta.type === "black") move.black = box;
  }

  return Array.from(movesMap.values()).sort((a, b) => a.moveNumber - b.moveNumber);
}