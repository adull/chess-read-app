import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function Hacks({ setBoxes }) {
  const handleAlmostPerfect = () => {
    const moves = [
      ["E4", "E5"],
      ["NC3", "F6"],
      ["BC4", "NC5"],
      ["NF3", "BC5"],
      ["NA4", "NA5"],
      ["BXG8", "BXF2"],
      ["KXF2", "RXG8"],
      ["D4", "NC6"],
      ["DXE5", "NXE5"],
      ["NXE5", "FXE5"],
      ["QH5!", "G6"],
      ["QH7", "QF6"],
      ["E6", "QF8"],
      ["QXG6", "KD8"],
      ["QG5!", "QE7"],
      ["QXF4", "D6"],
      ["EXD6", "CXD6"],
      ["RE1", "QD7"],
      ["QF6", "KC7"],
      ["RE7", ""],
    ];

    // layout configuration
    const baseTop = 20; // start lower (~500px down if total height ≈ 2500px)
    const rowGap = 4.2; // spacing between rows (%)
    const numCol = 8; // move numbers column
    const whiteCol = 20; // "Adlai White"
    const blackCol = 58; // "Danielle Black"
    const boxW = 8;
    const boxH = 3.2;

    const boxes = moves.flatMap((pair, i) => {
      const [white, black] = pair;
      const y = baseTop + i * rowGap;
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
