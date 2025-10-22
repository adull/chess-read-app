import MoveButton from "./MoveButton"
import InvalidMoveButton from "./InvalidMoveButton"

const Moves = (
    { boxes, 
      currentMoveIndex, 
      goToMove, 
      editMove, 
    }) => {
        const boxesToMoves = (boxes) => {

            const moves = [];
            let current = {};

            boxes.forEach((box) => {
            // If this is a move index marker (like "1.", "2.", etc.)
            if (/^\d+\.$/.test(box.text)) {
                // Push previous move if one exists
                if (Object.keys(current).length > 0) {
                moves.push(current);
                }

                current = { moveIndex: parseInt(box.text), whiteMove: null, blackMove: null };
            }
            else if (!current.whiteMove) {
                // First move after the index = white move
                current.whiteMove = box;
            }
            else if (!current.blackMove) {
                // Second move = black move
                current.blackMove = box;
            }
            });

            // Push the last one if it exists
            if (Object.keys(current).length > 0) {
                moves.push(current);
            }
            return moves;
        }
        // should change so that moves gets passed here but doing some frontend work first so adding this slop in instead.
        const moves = boxesToMoves(boxes)

        const INDEX_W = "w-12"; // ~3rem
        const CELL = "flex-1 min-h-10 flex items-stretch"; // common cell styling
        const SEP = "border-r border-gray-200";

        return (
            <div className="relative max-h-80 overflow-y-auto border border-gray-200 rounded-md text-sm">
              {/* sticky header */}
              <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                <div className="flex">
                  <div className={`${INDEX_W} ${SEP} py-2 flex items-center justify-center text-xs font-semibold text-gray-600 uppercase`}>
                    #
                  </div>
                  <div className={`${CELL} ${SEP}`}>
                    <div className="w-full py-2 flex items-center justify-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                      White
                    </div>
                  </div>
                  <div className={`${CELL}`}>
                    <div className="w-full py-2 flex items-center justify-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                      Black
                    </div>
                  </div>
                </div>
              </div>
        
              {/* rows */}
              <div>
                {moves.map((move, i) => {
                  const whiteIndex = move.whiteMove?.index ?? i * 2;
                  const blackIndex = move.blackMove?.index ?? i * 2 + 1;
        
                  return (
                    <div key={move.moveIndex ?? i} className="flex border-b border-gray-100">
                      {/* index col */}
                      <div className={`${INDEX_W} ${SEP} flex items-center justify-center font-mono text-xs text-gray-500`}>
                        {move.moveIndex ?? i + 1}
                      </div>
        
                      {/* white col */}
                      <div className={`${CELL} ${SEP}`}>
                        {move.whiteMove ? (
                          <div className="w-full p-2">
                            <MoveButton
                              box={move.whiteMove}
                              index={whiteIndex}
                              currentMoveIndex={currentMoveIndex}
                              onSelect={goToMove}
                              onEdit={editMove}
                            />
                          </div>
                        ) : (
                          <div className="w-full p-2 flex items-center justify-center text-gray-400 text-xs italic">
                            —
                          </div>
                        )}
                      </div>
        
                      {/* black col */}
                      <div className={`${CELL}`}>
                        {move.blackMove ? (
                          <div className="w-full p-2">
                            <MoveButton
                              box={move.blackMove}
                              index={blackIndex}
                              currentMoveIndex={currentMoveIndex}
                              onSelect={goToMove}
                              onEdit={editMove}
                            />
                          </div>
                        ) : (
                          <div className="w-full p-2 flex items-center justify-center text-gray-400 text-xs italic">
                            —
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        
        
}

export default Moves;