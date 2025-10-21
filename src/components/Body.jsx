import React, { useState, useEffect } from "react";
import UploadPanel from "./UploadPanel";
import ImagePanel from "./ImagePanel";
import ChessBoard from "./ChessBoard";
import { useSidebar } from "./sidebar/SidebarManager";
import { useModal } from "../hooks/useModal";
import { useChess } from "../hooks/useChess";
import { cheatMoves } from "../const";
import { setupBoxesWithCheatMoves } from "../helpers";

const Body = () => {
  const [imageUrl, setImageUrl] = useState('')

  const { addPanel, findPanel } = useSidebar()
  const { openModal } = useModal()
  const { boxes, derived, setBoxes, parseAndValidate } = useChess()

  useEffect(() => {
    if (boxes.length > 0 && !findPanel("hacks")) {
      import("../components/sidebar/Hacks").then(({ default: Hacks }) => {
        addPanel("hacks", Hacks, { boxes, setBoxes });
      });
    }
  }, [boxes, setBoxes, addPanel, findPanel]);
  

  const onCopyPgn = () => {
    console.log({pgn: derived.pgn})
  }
  const validateAndUpdateUi = () => {
    const uptodate = parseAndValidate()

    console.log({ boxes, derived})
    if(!uptodate.derived.success && uptodate.derived.problemBox) {
      import("../components/sidebar/ValidationErrorPanel").then(({ default: ValidationErrorPanel }) => {
        addPanel("validation-error-panel", ValidationErrorPanel, { onOpenEditor: async() => {
          const { default: InteractiveEditor } = await import("../components/modals/InteractiveEditor");
          openModal(InteractiveEditor, "interactive-editor", {
            size: "large"
          })
        } });
      });

    } else {
      import("../components/sidebar/SuccessPanel").then(({ default: SuccessPanel }) => {
        addPanel('success-panel', SuccessPanel, { onCopyPgn })
      })
    }
  }

  const setup = () => {
    setImageUrl('/clean.jpeg')
    setupBoxesWithCheatMoves(cheatMoves, setBoxes)
    
  }


  return (
    <div className="container mx-auto pb-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-roboto">
            Chess Position Analyzer
          </h2>
        </div>

        <button
              onClick={setup}
              className="bg-blue-600 hover:bg-blue-700 text-white text-md rounded-md px-3 py-1 transition-colors"
            >Set up </button>
        <UploadPanel
          onImageChange={(url) => setImageUrl(url)}
          onResult={(data) => {
            setBoxes(data.boxes || []);
          }}
        />

        {imageUrl && boxes.length > 0 && (
          <div className="mt-6">
            <button
              onClick={validateAndUpdateUi}
              className="bg-blue-600 hover:bg-blue-700 text-white text-md rounded-md px-3 py-1 transition-colors"
            >
              Validate position
            </button>
            <ImagePanel imageUrl={imageUrl} boxes={boxes} setBoxes={setBoxes} />
            
          </div>
        )}

        {derived.pgn && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <ChessBoard pgn={derived?.pgn} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
