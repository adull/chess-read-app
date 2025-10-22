import { memo } from "react";

const MoveButton = ({ box, index, currentMoveIndex, onSelect, onEdit }) => {
  const isCurrent = index === currentMoveIndex;
  const isInvalid = box.validity === "invalid";
  const isUnreached = box.validity === "unreached";

  const baseClass =
    "w-full p-2 rounded text-left flex justify-between items-center transition-colors";
  const variantClass = isInvalid
    ? "bg-red-200 text-red-800 border-2 border-red-400"
    : isCurrent
    ? "bg-blue-200 text-blue-800 border-2 border-blue-400"
    : "bg-white hover:bg-gray-100 border border-gray-200";

  return (
    <div className={`${baseClass} ${variantClass}`}>
      <button
        className="font-mono font-semibold flex-1 text-left truncate"
        disabled={isUnreached}
        onClick={() => onSelect(index)}
      >
        {box.text}
        {isUnreached && (
          <span className="ml-1 text-xs text-gray-500">(unreached)</span>
        )}
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
};

export default memo(MoveButton);
