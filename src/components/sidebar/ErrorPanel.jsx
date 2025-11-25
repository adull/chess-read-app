import React from 'react';
import { useChess } from '../../hooks/useChess';

const ErrorPanel = ({ onClose, errorMessage }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-red-700">
          Invalid Move Detected
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
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-sm text-red-800 mb-2">
          <strong>Error:</strong>
        </p>
        <p className="text-xs text-red-600">
            {errorMessage}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md px-3 py-2 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ErrorPanel;
