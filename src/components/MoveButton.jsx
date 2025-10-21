import { memo } from 'react'
const MoveButton = ({
    move,
    index,
    currentMoveIndex,
    onSelect,
    onEdit,
  }) => {
    // console.log({ move })
    const isCurrent = index === currentMoveIndex;
    const isInvalid = !move.isValid;
  
    const baseClass =
      "p-3 rounded text-left flex justify-between items-center transition-colors";
    const variantClass = isCurrent
      ? "bg-blue-200 text-blue-800 border-2 border-blue-400"
      : isInvalid
      ? "bg-red-200 text-red-800 border-2 border-red-400"
      : "bg-white hover:bg-gray-100 border border-gray-200";
  
    return (
      <div className={`${baseClass} ${variantClass}`}>
        <button
          className="font-mono font-semibold flex-1 text-left"
          onClick={() => onSelect(index)}
        >
          {Math.floor(index / 2) + 1}. {move.move}
        </button>
        <button
          className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(index);
          }}
        >
          Edit
        </button>
      </div>
    );
  }
  
  export default memo(MoveButton);