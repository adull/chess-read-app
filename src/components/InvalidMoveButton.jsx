import MoveButton from "./MoveButton";

export default function InvalidMoveButton({ problemBox }) {
  if (!problemBox) return null;

  return (
    <div className="mt-4 border-t border-gray-300 pt-3">
      <h4 className="text-sm font-semibold text-red-700 mb-2">Invalid Move</h4>

      <MoveButton
        move={{
          move: problemBox.text,
          validity: problemBox.validity,
          isValid: false,
        }}
        currentMoveIndex="999"
        onSelect={() => {}}
        onEdit={() => {}}
      />
    </div>
  );
}
