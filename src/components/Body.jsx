import React, { useState } from "react";
import { toast } from 'react-toastify';
import UploadPanel from "./UploadPanel";
import ImagePanel from "./ImagePanel";
import ChessBoard from "./ChessBoard";
import ChessHacksToast from './ChessHacksToast'
import InteractiveEditor from './InteractiveEditor'
import { validatePosition } from '../helpers'

const Body = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [pgn, setPgn] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");

  const validatePositionFromBoxes = () => {
    const res = validatePosition(boxes);
  
    if (res.success) {
      setPgn(res.fullPGN);
      setBoxes(prev => prev.map(b => ({ ...b, isError: false })));
      toast.success("Position validated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      console.warn(res.message);
  
      // Use partialPGN if available
      if (res.partialPGN) {
        setPgn(res.partialPGN);
      }
  
      setBoxes(prev =>
        prev.map(b =>
          b.id === res.invalidBoxId
            ? { ...b, isError: true }
            : { ...b, isError: false }
        )
      );

      // Show error toast with interactive editor option
      const ErrorContent = () => (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-red-800 mb-1">Validation Error</div>
          <div className="text-sm text-gray-700 mb-3">{res.message}</div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentErrorMessage(res.message);
                setIsEditorOpen(true);
                toast.dismiss();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md px-3 py-1 transition-colors"
            >
              Open Interactive Editor
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-md px-3 py-1 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      );

      toast.error(<ErrorContent />, {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        toastId: "validation-error", // Ensure only one validation error toast at a time
      });
    }
  };
  

  return (
    <div className="container mx-auto pb-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 font-roboto">
          Chess Position Analyzer
        </h2>

        <UploadPanel
          onImageChange={(url) => setImageUrl(url)}
          onResult={(data) => {
            setBoxes(data.boxes || []);
            setPgn(data.pgn || "");
          }}
        />

        {imageUrl && boxes.length > 0 && (
          <div className="mt-6">
            <ImagePanel imageUrl={imageUrl} boxes={boxes} setBoxes={setBoxes} validatePositionFromBoxes={validatePositionFromBoxes} />
            <ChessHacksToast boxes={boxes} setBoxes={setBoxes} />
          </div>
        )}

        {pgn && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <ChessBoard pgn={pgn} />
          </div>
        )}

        <InteractiveEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          boxes={boxes}
          setBoxes={setBoxes}
          errorMessage={currentErrorMessage}
          imageUrl={imageUrl}
        />
      </div>
    </div>
  );
};

export default Body;
