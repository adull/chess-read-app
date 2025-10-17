import React, { useState, useEffect } from "react";
import UploadPanel from "./UploadPanel";
import ImagePanel from "./ImagePanel";
import ChessBoard from "./ChessBoard";
import { useSidebar } from "./sidebar/SidebarManager";
import { useModal } from "../contexts/ModalContext";
import { useChessData } from "../hooks/useChessData";

const Body = () => {

  const { addPanel, findPanel } = useSidebar()
  const { openModal } = useModal()

  const {
    imageUrl, setImageUrl,
    boxes, setBoxes,
    pgn, setPgn,
    validatePositionFromBoxes,
  } = useChessData({ addPanel, findPanel, openModal });

  return (
    <div className="container mx-auto pb-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-roboto">
            Chess Position Analyzer
          </h2>
        </div>

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
