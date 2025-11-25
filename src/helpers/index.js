import { Chess } from "chess.js";


export const isPromotionMove = (piece, targetSquare) => {
  return (
    piece.toLowerCase() === 'p' &&
    (targetSquare[1] === '8' || targetSquare[1] === '1')
  );
};

export const getSanForMove = (chessGame, { from, to, promotion }) => {
  const moves = chessGame.moves({ verbose: true });
  const match = moves.find(m =>
    m.from === from &&
    m.to === to &&
    (promotion ? m.promotion === promotion : true)
  );
  return match ? match.san : null;
}

export const tryMove = ({ chess, box, color, moveIndex }) => {
  const san = box.text?.trim();

  if (!san) {
    return { success: true };
  }

  try {
    const move = chess.move(san, { sloppy: true });

    if (move) {
      return { success: true };
    }

    // Illegal move (chess.move returned null)
    return {
      success: false,
      error: `Illegal ${color} move at move ${moveIndex + 1}: "${san}"`,
      moveNumber: moveIndex + 1,
      color
    };

  } catch (err) {
    return {
      success: false,
      error: err.message || `Invalid ${color} move "${san}"`,
      moveNumber: moveIndex + 1,
      color
    };
  }
};

export function* validateMovesLive(moves) {
  console.log({ moves })
  const chess = new Chess();
  let stopped = false;

  const annotate = (obj, validity, error = null) =>
    obj ? { text: obj, validity, error } : null;

  const updatedMoves = moves.map(m => ({
    moveNumber: m.moveNumber,
    white: m.white ? { text: m.white } : null,
    black: m.black ? { text: m.black } : null,
  }));
  console.log({ updatedMoves })

  for (let i = 0; i < updatedMoves.length; i++) {
    const move = updatedMoves[i];

    if (stopped) {
      if (move.white) move.white = annotate(move.white, "unreached");
      if (move.black) move.black = annotate(move.black, "unreached");
      continue;
    }

    // ---- WHITE ----
    if (move.white) {
      const result = tryMove({ chess, box: move.white, color: "white", moveIndex: i });
      if (result.success) {
        move.white = annotate(move.white.text, "valid");

        yield {
          moveNumber: move.moveNumber,
          color: "white",
          success: true,
          updatedMove: move,
          pgn: chess.pgn(),    // <-- SUCCESS PGN HERE
        };

      } else {
        move.white = annotate(move.white, "invalid", result.error);
        stopped = true;

        yield {
          moveNumber: move.moveNumber,
          color: "white",
          success: false,
          updatedMove: move,
          pgn: chess.pgn(),
          issue: {
            moveNumber: result.moveNumber,
            color: result.color,
            message: result.error
          }
        };
        return;
      }
    }

    // ---- BLACK ----
    if (move.black) {
      const result = tryMove({ chess, box: move.black, color: "black", moveIndex: i });

      if (result.success) {
        move.black = annotate(move.black.text, "valid");

        yield {
          moveNumber: move.moveNumber,
          color: "black",
          success: true,
          updatedMove: move,
          pgn: chess.pgn(),   // <-- SUCCESS PGN HERE
        };

      } else {
        move.black = annotate(move.black, "invalid", result.error);
        stopped = true;

        yield {
          moveNumber: move.moveNumber,
          color: "black",
          success: false,
          updatedMove: move,
          pgn: chess.pgn(),
          issue: {
            moveNumber: result.moveNumber,
            color: result.color,
            message: result.error
          }
        };
        return;
      }
    }
  }
}
