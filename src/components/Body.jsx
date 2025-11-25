import React, { useState, useEffect, useCallback } from "react";
import UploadPanel from "./UploadPanel";
import ImagePanel from "./ImagePanel";
import ChessBoard from "./ChessBoard";
import PgnDisplay from './modals/PgnDisplay'
import CopyPgnButton from "./CopyPgnButton"
import MovesEditor from "./MovesEditor"
import { useSidebar } from "./sidebar/SidebarManager";
import { useModal } from "../hooks/useModal";
import { useChess } from "../hooks/useChess";
import { cheatMoveList } from "../const";
import { validateMovesLive } from "../helpers";

const Body = () => {
  const [imageUrl, setImageUrl] = useState('')

  const { addPanel, findPanel } = useSidebar()
  const { openModal } = useModal()
  // const { moves, pgn,  pgnIsComplete, setMoves, parseAndValidate } = useChess()
  const [moveList, setMoveList] = useState([])
  const [pgn, setPgn] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [pgnIssue, setPgnIssue] = useState({ hasIssue: false, moveNumber: -1, turn: 'white' })
  

  const onCopyPgn = () => {
    navigator.clipboard.writeText(pgn);
  }

  const openPgnModal = () => {
    openModal(PgnDisplay, "pgn-display", { size: "large" })
  }

  useEffect(() => {
    const validator = validateMovesLive(moveList);
  
    for (const step of validator) {
      if (step.success) {
        setPgn(step.pgn);   // <-- Update PGN here
      }
  
      if (!step.success && step.issue) {
        console.log(`ISSUE`)
        console.log({
          hasIssue: true,
          moveNumber: step.issue.moveNumber,
          turn: step.issue.color,
          message: step.issue.message
        })
        setPgnIssue({
          hasIssue: true,
          moveNumber: step.issue.moveNumber,
          turn: step.issue.color,
          message: step.issue.message
        });
        break;
      }
    }

    setIsDone(true)

    // console.log(moveList)
    // console.log(`json`)
    // console.log(JSON.stringify(moveList))
  }, [moveList]);
  
  

  // const validateAndUpdateUi = () => {
  //   const validation = parseAndValidate()

  //   if(!validation.success && validation.problemBox) {
  //     import("../components/sidebar/ValidationErrorPanel").then(({ default: ValidationErrorPanel }) => {
  //       addPanel("validation-error-panel", ValidationErrorPanel, { onOpenEditor: async() => {
  //         const { default: InteractiveEditor } = await import("../components/modals/InteractiveEditor");
  //         openModal(InteractiveEditor, "interactive-editor", {
  //           size: "large"
  //         })
  //       } });
  //     });

  //   } else {
  //     import("../components/sidebar/SuccessPanel").then(({ default: SuccessPanel }) => {
  //       addPanel('success-panel', SuccessPanel, { onCopyPgn, openPgnModal })
  //     })
  //   }
  // }

  // const setup = () => {
  //   setImageUrl('/clean.jpeg')
  //   const newBoxes = setupBoxesWithCheatMoves(cheatMoves, setBoxes)
    
  // }

  // const logMoves = useCallback(() => {
  //   console.log(moves);
  //   console.log(JSON.stringify(moves));
  // }, [moves]);


  const updateMoves = (move) => {
    console.log({ move })
    if (!move) return
    setMoveList(prev => {
      const copy = [...prev]
      let existing = copy.find(item => item.moveNumber === move.moveNumber);
      if (!existing) {
        existing = { moveNumber: move.moveNumber }
        copy.push(existing)
      }
      existing[move.type] = move.text
      return copy
    });
  }

  const setup = () => {
    setMoveList(cheatMoveList)
  }



  return (
    <div className="container mx-auto pb-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-roboto">
            Chess Notation Reader
          </h2>
        </div>

        <button
              onClick={setup}
              className="bg-blue-600 hover:bg-blue-700 text-white text-md rounded-md px-3 py-1 transition-colors"
            >Set up </button>
        {/* <UploadPanel
          onImageChange={(url) => setImageUrl(url)}
          onResult={(move) => updateMoves(move)}
        /> */}

        {moveList.length > 0 && (
          <>
            <ChessBoard pgn={pgn} moveList={moveList} pgnIssue={pgnIssue} onChangeMove={updateMoves} />
          </>
        )}
        
      </div>
    </div>
  );
};

export default Body;
