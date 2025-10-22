import React, { useRef, useState, useCallback } from "react";
import Box from "./Box";

const ImagePanel = ({ imageUrl, boxes, setBoxes, validatePositionFromBoxes }) => {
  const [activeBoxId, setActiveBoxId] = useState(null);
  const containerRef = useRef(null); // <-- important

  const handleUpdateBox = useCallback((updatedBox) => {
    setBoxes((prev) =>
      prev.map((b) => (b.id === updatedBox.id ? updatedBox : b))
    );
  }, [setBoxes]);

  const handleDeleteBox = useCallback((id) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  }, [setBoxes]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <img
        src={imageUrl}
        alt="Analyzed"
        className="max-w-full h-auto border rounded-lg select-none"
      />

      {boxes.map((box) => (
        <Box
          key={box?.id}
          box={box}
          onUpdate={handleUpdateBox}
          onDelete={handleDeleteBox}
          activeBoxId={activeBoxId}
          setActiveBoxId={setActiveBoxId}
          containerRef={containerRef}
        />
      ))}
    </div>
    
  );
};

export default ImagePanel;
