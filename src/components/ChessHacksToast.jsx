import React from 'react';
import { toast } from 'react-toastify';
import { useChessHacks } from '../hooks/useChessHacks';

const ChessHacksToast = ({ boxes, setBoxes }) => {
  const { handleAlmostPerfect, handleLogMoves } = useChessHacks();

  const showHacksToast = () => {
    const HacksContent = () => (
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Chess Hacks</h3>
        <button
          onClick={() => {
            handleAlmostPerfect(setBoxes);
            toast.dismiss();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md px-3 py-1 transition-colors w-full"
        >
          Almost Perfect Format
        </button>
        <button
          onClick={() => {
            handleLogMoves(boxes);
            toast.dismiss();
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-md px-3 py-1 transition-colors w-full"
        >
          Log Moves
        </button>
      </div>
    );

    toast.info(<HacksContent />, {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: true,
      toastId: "chess-hacks", // This ensures only one hacks toast is shown at a time
    });
  };

  // Show the hacks toast when component mounts
  React.useEffect(() => {
    showHacksToast();
  }, []);

  return null; // This component doesn't render anything visible
};

export default ChessHacksToast;
