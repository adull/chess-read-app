import { Chess } from "chess.js";

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

export const handlePartialPGNResult = async (result, addPanel, openModal) => {
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
  if (result.problemBox) {
    movesWithValidity.push({
      move: result.problemBox.text || result.problemBox.move || '[invalid]',
      isValid: false
    });
  }
  console.log({ movesWithValidity})

  // Dynamically import sidebar panel
  const { default: ValidationErrorPanel } = await import("../components/sidebar/ValidationErrorPanel");

  addPanel("validation-error", ValidationErrorPanel, {
    validationError: result,
    onOpenEditor: async () => {
      // Dynamically import the editor modal
      const { default: InteractiveEditor } = await import("../components/modals/InteractiveEditor");

      openModal(InteractiveEditor, "interactive-editor", {
        size: "large",
        pgn: result.pgn,
        moves: movesWithValidity,
        problemBox: result.problemBox,
        onMoveUpdate: (moveData) => {
          console.log("Move updated:", moveData);
          // You can later wire this to re-run parseAndValidate
          // or revalidateMoves(moveData) here.
        },
      });
    },
  });

}