import React from "react";
import { cheatMoves } from '../../const'
import { setupBoxesWithCheatMoves } from '../../helpers'

import { v4 as uuidv4 } from "uuid";

export default function Hacks({ upload, boxes, setBoxes, onClose }) {
  const handleAlmostPerfect = () => {
    const moves = cheatMoves;
    setupBoxesWithCheatMoves(moves, setBoxes);
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

  const uploadAndHandleAlmostPerfect = () => {
    upload();
    handleAlmostPerfect();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
          Hacks
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ×
          </button>
        )}
      </div>
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
