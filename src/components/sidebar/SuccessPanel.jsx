import React from "react";

const SuccessPanel = ({ onClose, onCopyPgn }) => {
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-green-700">
          Valid PGN
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ×
          </button>
        )}
      </div>

      <p className="text-sm text-gray-700">
        Your chess notation is valid.
      </p>

      <div className="flex flex-col gap-2">
        <button
          onClick={onCopyPgn}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md px-3 py-2 transition-colors"
        >
          Copy PGN to Clipboard
        </button>

        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md px-3 py-2 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default SuccessPanel;
