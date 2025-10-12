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
    const res = validatePosition(boxes)
    console.log({ res })
    setPgn(res.fullPGN)
  }

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
            <Hacks setBoxes={setBoxes} />
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
