import React, { useState } from "react";
import { useChess } from "../../hooks/useChess";

const PgnDisplay = () => {
  const { derived } = useChess();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!derived.pgn) return;
    await navigator.clipboard.writeText(derived.pgn);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // fade after 1.5s
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm text-center relative">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Copy your PGN below
      </h3>

      <textarea
        readOnly
        value={derived.pgn}
        className="w-full h-48 p-3 border border-gray-300 rounded-md resize-none font-mono text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="mt-4 flex justify-center relative">
        <button
          onClick={handleCopy}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors"
        >
          Copy PGN to Clipboard
        </button>

        {/* Copied! floating text */}
        {copied && (
          <span
            className="absolute text-green-700 text-sm font-semibold animate-bounce-fade"
            style={{ top: "-1.5rem" }}
          >
            Copied!
          </span>
        )}
      </div>
    </div>
  );
};

export default PgnDisplay;
