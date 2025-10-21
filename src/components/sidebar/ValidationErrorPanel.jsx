import React, {useEffect} from 'react';
import { useChess } from '../../hooks/useChess';

const ValidationErrorPanel = ({ onClose, onOpenEditor }) => {
  // console.log({ problemBox})
  const { boxes, derived } = useChess()
  console.log(derived)
  useEffect(() => {
    console.log({ boxes })
  }, [boxes])

  useEffect(() => {
    console.log({ derived })
  }, [derived])
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
          <strong>Error:</strong> {derived.problemBox?.error}
        </p>
        <p className="text-xs text-red-600">
          The move sequence is valid up to this point, but the next move is invalid.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onOpenEditor}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md px-3 py-2 transition-colors"
        >
          Open Interactive Editor
        </button>
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

export default ValidationErrorPanel;
