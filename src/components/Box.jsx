import React, { useState, useRef, useEffect, memo } from "react";
import { FaEdit, FaTrash, FaArrowsAlt } from "react-icons/fa";

const Box = ({
  box,
  onUpdate,
  onDelete,
  activeBoxId,
  setActiveBoxId,
  containerRef,
}) => {
  const isActive = activeBoxId === box.id;
  const [isHovered, setIsHovered] = useState(false);
  const [text, setText] = useState(box.text);

  const [position, setPosition] = useState({
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({});
  const inputRef = useRef(null);

  // Sync local position when parent updates
  useEffect(() => {
    setPosition({
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height,
    });
  }, [box.top, box.left, box.width, box.height]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isActive && inputRef.current) inputRef.current.focus();
  }, [isActive]);

  const handleMouseDown = (e, action) => {
    e.stopPropagation();
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      left: position.left,
      top: position.top,
      width: position.width,
      height: position.height,
      containerWidth: container.offsetWidth,
      containerHeight: container.offsetHeight,
    };

    if (action === "move") setIsDragging(true);
    if (action === "resize") setIsResizing(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    const {
      x,
      y,
      left,
      top,
      width,
      height,
      containerWidth,
      containerHeight,
    } = dragStart.current;

    const dx = ((e.clientX - x) / containerWidth) * 100;
    const dy = ((e.clientY - y) / containerHeight) * 100;

    if (isDragging) {
      const newLeft = Math.max(0, Math.min(left + dx, 100 - width));
      const newTop = Math.max(0, Math.min(top + dy, 100 - height));

      setPosition((prev) => ({ ...prev, left: newLeft, top: newTop }));
    }

    if (isResizing) {
      const newWidth = Math.max(0, Math.min(width + dx, 100 - left));
      const newHeight = Math.max(0, Math.min(height + dy, 100 - top));

      setPosition((prev) => ({ ...prev, width: newWidth, height: newHeight }));
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (isDragging || isResizing) onUpdate({ ...box, ...position });

    setIsDragging(false);
    setIsResizing(false);
  };

  const handleSaveText = () => {
    onUpdate({ ...box, text });
    setActiveBoxId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setText(box.text);
      setActiveBoxId(null);
    }
    if (e.key === "Enter") handleSaveText();
  };

  return (
    <div
      className={`
        absolute border-2 transition-all duration-150 rounded 
        ${box.isError
          ? "border-red-500 bg-red-100/60 animate-[shake_0.2s_ease-in-out]"
          : isHovered
          ? "border-yellow-400 bg-blue-500/10"
          : "border-blue-500 bg-blue-500/10"}
      `}
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
        zIndex: isActive ? 50 : 10,
        pointerEvents:
          activeBoxId && activeBoxId !== box.id ? "none" : "auto",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label + Controls */}
      <div
        className="absolute -top-6 left-0 flex items-center gap-2"
        style={{ zIndex: 100 }}
      >
        {isActive ? (
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-xs bg-white border border-blue-400 rounded px-1 py-0.5 pr-5 focus:outline-none"
            />
            <button
              onClick={handleSaveText}
              className="absolute right-0.5 text-green-600 text-xs font-bold"
            >
              ✓
            </button>
          </div>
        ) : (
          <span
            className={`text-xs px-1 rounded ${
              box.isError ? "bg-red-600" : "bg-blue-700"
            } text-white`}
          >
            {box.text}
          </span>
        )}

        {/* Icon controls */}
        {isHovered && !isActive && (
          <div className="flex gap-1 animate-[fadeIn_0.2s_ease-in-out]">
            <button
              onClick={() => setActiveBoxId(box.id)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded"
              title="Edit"
            >
              <FaEdit size={10} />
            </button>
            <button
              onClick={() => onDelete(box.id)}
              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
              title="Delete"
            >
              <FaTrash size={10} />
            </button>
            <button
              onMouseDown={(e) => handleMouseDown(e, "move")}
              className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded cursor-grab"
              title="Move"
            >
              <FaArrowsAlt size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        className="absolute w-3 h-3 bg-yellow-400 bottom-0 right-0 cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, "resize")}
      ></div>
    </div>
  );
};

export default memo(Box);
