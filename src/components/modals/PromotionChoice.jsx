import React from 'react';

const PromotionChoice = ({ color = 'w', choosePiece }) => {
    console.log({ color, choosePiece})
  const pieces = ['q', 'r', 'b', 'n'];
  const pieceNames = {
    q: 'Queen',
    r: 'Rook',
    b: 'Bishop',
    n: 'Knight'
  };

  const pieceUrl = (piece) =>
    `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${`w`}${piece}.png`;

  return (
    <div className="bg-white rounded-xl p-6 text-center">
      <h3 className="text-lg font-semibold mb-4">Choose a piece to promote to</h3>
      <div className="flex justify-center gap-4">
        {pieces.map((p) => (
          <button
            key={p}
            onClick={() => choosePiece(p)}
            className="transition-transform hover:scale-110 focus:scale-110"
          >
            <img
              src={pieceUrl(p)}
              alt={pieceNames[p]}
              className="w-12 h-12 drop-shadow-md"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromotionChoice;
