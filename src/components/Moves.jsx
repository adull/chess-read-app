import MoveButton from "./MoveButton"
import InvalidMoveButton from "./InvalidMoveButton"

const Moves = (
    { moveHistory, 
      problemBox, 
      currentMoveIndex, 
      goToMove, 
      editMove, 
      confirmMove, 
    }) => {
        return (
        <div className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 text-sm">
                {moveHistory.map((move, index) => (
                    <MoveButton
                    key={index}
                    move={move}
                    index={index}
                    currentMoveIndex={currentMoveIndex}
                    onSelect={goToMove}
                    onEdit={editMove}
                    />
                ))}
                { problemBox && !confirmMove && <InvalidMoveButton problemBox={problemBox} /> }
            </div>
        </div>
        )
}

export default Moves;