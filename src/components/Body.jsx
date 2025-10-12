import React, { useState } from "react";
import UploadPanel from "./UploadPanel";
import ImagePanel from "./ImagePanel";
import ChessBoard from "./ChessBoard";
import Hacks from './Hacks'
import { validatePosition } from '../helpers'

const Body = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [pgn, setPgn] = useState("");

  const validatePositionFromBoxes = () => {
    const res = validatePosition(boxes);
    console.log({ res });
  
    if (res.success) {
      // All moves valid
      setPgn(res.fullPGN);
      setBoxes(prev => prev.map(b => ({ ...b, isError: false })));
    } else {
      console.warn(res.message);
  
      // ✅ Use partialPGN if available
      if (res.partialPGN) {
        setPgn(res.partialPGN);
      }
  
      // Highlight the invalid move box
      setBoxes(prev =>
        prev.map(b =>
          b.id === res.invalidBoxId
            ? { ...b, isError: true }
            : { ...b, isError: false }
        )
      );
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
            <Hacks boxes={boxes} setBoxes={setBoxes} />
          </div>
        )}

        {pgn && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <ChessBoard pgn={pgn} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
