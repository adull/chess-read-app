import { Chess } from "chess.js";

const _normalizeMove = (text) => {
  if (!text) return "";
  return text
    .trim()
    .replace(/!/g, "")
    .replace(/\?/g, "")
    .replace(/X/g, "x")
    .replace(/[^a-zA-Z0-9=+#x-]/g, "")
    .replace(/^([nbrqk])?([A-H])/, (_, piece, file) => {
      // lowercase the file letter but not the piece
      return (piece ? piece.toUpperCase() : "") + file.toLowerCase();
    });
};

const validatePosition = (boxes) => {
  const chess = new Chess();

  const moveMap = {};
  const moves = [];

  for (let i = 0; i < boxes.length; i += 3) {
    const moveNumber = boxes[i]?.text?.replace(/\./g, "").trim();
    const whiteMove = boxes[i + 1]?.text?.trim();
    const blackMove = boxes[i + 2]?.text?.trim();

    if (!moveNumber) continue;

    moveMap[moveNumber] = { white: whiteMove || null, black: blackMove || null };
    moves.push([whiteMove, blackMove]);
  }

  for (let i = 0; i < moves.length; i++) {
    const [whiteRaw, blackRaw] = moves[i];
    // const white = _normalizeMove(whiteRaw);
    // const black = _normalizeMove(blackRaw);
    const white = whiteRaw
    const black = blackRaw

    if (white) {
      const move = chess.move(white, { sloppy: true });
      if (!move) {
        return {
          moveNumber: i + 1,
          moveColor: "white",
          moveText: whiteRaw,
          message: `❌ Invalid white move "${whiteRaw}" at move ${i + 1}`,
          partialPGN: chess.pgn(),
        };
      }
    }

    if (black) {
      const move = chess.move(black, { sloppy: true });
      if (!move) {
        return {
          moveNumber: i + 1,
          moveColor: "black",
          moveText: blackRaw,
          message: `❌ Invalid black move "${blackRaw}" at move ${i + 1}`,
          partialPGN: chess.pgn(),
        };
      }
    }
  }

  return {
    message: "✅ All moves are valid!",
    fullPGN: chess.pgn(),
  };
};

export { validatePosition };
