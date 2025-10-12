import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function Hacks({ setBoxes }) {
  const handleAlmostPerfect = () => {
    const moves = [
        ["e4", "e5"],
        ["Nc3", "f6"],
        ["Bc4", "Nc6"],
        ["Nf3", "Bc5"],
        ["Na4", "Na5"],
        ["Bxg8", "Bxf2+"],
        ["Kxf2", "Rxg8"],
        ["d4", "Nc6"],
        ["dxe5", "Nxe5"],
        ["Nxe5", "fxe5"],
        ["Rf1", "Rf8"],
        // ["Kg1", "Rg4"],
        // ["Bg4", "fxg4"],
        // ["Qh5", "g6"],
        // ["Qh7", "Qf6"],
        // ["e6", "Qf8"],
        // ["Qxg6", "Kd8"],
        // ["Qg5", "Qe7"],
        // ["Qxf4", "d6"],
        // ["exd6", "cxd6"],
        // ["Re1", "Qd7"],
        // ["Qf6", "Kc7"],
        // ["Re7", ""],
      ];      

    // layout configuration
    const startTop = 24;   // a little lower (roughly below headers)
    const endBottom = 90;  // stop ~5% from bottom
    const numMoves = moves.length;
    const totalSpan = endBottom - startTop;
    const rowGap = totalSpan / (numMoves - 1);

    const numCol = 8;      // move numbers
    const whiteCol = 20;   // "Adlai White"
    const blackCol = 58;   // "Danielle Black"
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
        });
      }

      return rowBoxes;
    });

    setBoxes(boxes);
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur border border-gray-300 shadow-md rounded-xl p-3 flex flex-col gap-2">
      <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
        Hacks
      </h2>
      <button
        onClick={handleAlmostPerfect}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md px-3 py-1 transition-colors"
      >
        Almost Perfect Format
      </button>
    </div>
  );
}
