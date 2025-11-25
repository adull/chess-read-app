import React from "react";

const ReplaceMovePanel = ({ onClose, before, now, onReplaceMove }) => {
  const replace = () => {
    onReplaceMove()
    onClose()
  }
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-green-700">
          Do you want to change the move from <b>{before}</b> to <b>{now}</b> ?
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


      <div className="flex flex-col gap-2">
        <button
            onClick={replace}
            className="bg-white border border-green-600 text-green-700 hover:bg-green-600 hover:text-white text-sm font-medium rounded-md px-3 py-2 transition-colors"
          >
          Yes
        </button>

        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md px-3 py-2 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ReplaceMovePanel;
