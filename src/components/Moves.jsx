import { useEffect, useRef } from "react";
import { useChess } from "../hooks/useChess";
import MoveButton from "./MoveButton"
import InvalidMoveButton from "./InvalidMoveButton"

const Moves = (
    { moves, 
      currentMoveIndex, 
      goToMove, 
      editMove, 
    }) => {

      const { problemBox } = useChess()
      const containerRef = useRef(null)
      const moveRefs = useRef({})
      const INDEX_W = "w-12"; 
      const CELL = "flex-1 min-h-10 flex items-stretch"; 
      const SEP = "border-r border-gray-200";

      useEffect(() => {
        if(!problemBox || !problemBox.meta?.moveNumber) return

        const moveNum = problemBox.meta.moveNumber;
        const el = moveRefs.current[moveNum];
        if (el && containerRef.current) {
          const container = containerRef.current;
          // const offsetTop = el.offsetTop - container.offsetTop;
          const offsetTop = el.offsetTop;

          
          container.scrollTo({
            top: offsetTop - 40,
            behavior: "smooth",
          });
        }
      }, [problemBox])

      return (
          <div ref={containerRef} className="relative max-h-80 overflow-y-auto border border-gray-200 rounded-md text-sm">
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
                  <div key={move.moveIndex ?? i} 
                       className="flex border-b border-gray-100"
                       ref={(el) => {
                        if(el) moveRefs.current[move.moveNumber] = el
                       }}
                  >
                    {/* index col */}
                    <div className={`${INDEX_W} ${SEP} flex items-center justify-center font-mono text-xs text-gray-500`}>
                      {move.moveIndex ?? i + 1}
                    </div>
      
                    {/* white col */}
                    <div className={`${CELL} ${SEP}`}>
                      {move.white ? (
                        <div className="w-full p-2">
                          <MoveButton
                            box={move.white}
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
                      {move.black ? (
                        <div className="w-full p-2">
                          <MoveButton
                            box={move.black}
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