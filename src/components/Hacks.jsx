import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function Hacks({ boxes, setBoxes }) {
  const handleAlmostPerfect = () => {
    const moves = [
        [
          "e4",
          "e5"
        ],
        [
          "Nc3",
          "f6"
        ],
        [
          "Bc4",
          "Nc6"
        ],
        [
          "Nf3",
          "Bc5"
        ],
        [
          "Na4",
          "Na5"
        ],
        [
          "Bxg8",
          "Bxf2+"
        ],
        [
          "Kxf2",
          "Rxg8"
        ],
        [
          "d4",
          "Nc6"
        ],
        [
          "dxe5",
          "Nxe5"
        ],
        [
          "Nxe5",
          "fxe5"
        ],
        [
          "Rf1",
          "Rf8"
        ],
        [
          "Kg1",
          "Rf4"
        ],
        [
          "Bf4",
          "exf4"
        ],
        [
          "Qh5",
          "g6"
        ],
        [
          "Qh7",
          "Qf6"
        ],
        [
          "e5",
          "Qf8"
        ],
        [
          "Qxg6",
          "Kd8"
        ],
        [
          "Qg5",
          "Qe7"
        ],
        [
          "Qxf4",
          "d6"
        ],
        [
          "exd6",
          "cxd6"
        ],
        [
          "Re1",
          "Qd7"
        ],
        [
          "Qf6",
          "Kc7"
        ],
        [
          "Re7",
          ""
        ]
      ];

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

  const handleLogMoves = () => {
    // extract moves from current boxes
    const sorted = [...boxes].sort((a, b) => a.top - b.top || a.left - b.left);

    const triples = [];
    for (let i = 0; i < sorted.length; i += 3) {
      const moveNum = sorted[i]?.text || "";
      const white = sorted[i + 1]?.text || "";
      const black = sorted[i + 2]?.text || "";
      triples.push([white, black]);
    }

    console.log("------ Current Moves ------");
    console.log(
      "const moves = " + JSON.stringify(triples, null, 2) + ";"
    );
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
      <button
        onClick={handleLogMoves}
        className="bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-md px-3 py-1 transition-colors"
      >
        Log Moves
      </button>
    </div>
  );
}
