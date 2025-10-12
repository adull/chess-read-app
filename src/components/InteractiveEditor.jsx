import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import InteractiveChessBoard from './InteractiveChessBoard';
import { getCurrentPosition } from '../helpers/positionHelper';
import Box from './Box';

const InteractiveEditor = ({ isOpen, onClose, boxes, setBoxes, errorMessage, imageUrl }) => {
  const [activeTab, setActiveTab] = useState('image');
  const [editingBoxId, setEditingBoxId] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedMove, setSelectedMove] = useState('');
  const scrollContainerRef = useRef(null);
  const [activeBoxId, setActiveBoxId] = useState(null);
  const containerRef = useRef(null);

  if (!isOpen) return null;

  const handleEditBox = (box) => {
    setEditingBoxId(box.id);
    setEditText(box.text);
    setSelectedMove('');
    
    // Scroll to the box being edited
    setTimeout(() => {
      const boxElement = document.getElementById(`box-${box.id}`);
      if (boxElement && scrollContainerRef.current) {
        boxElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const handleUpdateBox = (updatedBox) => {
    setBoxes((prev) =>
      prev.map((b) => (b.id === updatedBox.id ? updatedBox : b))
    );
  };

  const handleDeleteBox = (id) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSaveEdit = () => {
    if (editingBoxId) {
      setBoxes(prev => 
        prev.map(box => 
          box.id === editingBoxId 
            ? { ...box, text: editText }
            : box
        )
      );
      setEditingBoxId(null);
      setEditText('');
      toast.success("Move updated successfully!");
    }
  };

  const handleCancelEdit = () => {
    setEditingBoxId(null);
    setEditText('');
    setSelectedMove('');
  };

  const handleChessBoardMove = (move) => {
    setSelectedMove(move);
    setEditText(move);
    
    // Log the move to console
    console.log(`Selected move: ${move}`);
    console.log(`Current position: ${getCurrentPosition(boxes, editingBoxId).position}`);
    console.log(`Is white to move: ${getCurrentPosition(boxes, editingBoxId).isWhiteToMove}`);
    
    toast.info(`Update move to "${move}"?`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleConfirmMove = () => {
    if (selectedMove && editingBoxId) {
      setBoxes(prev => 
        prev.map(box => 
          box.id === editingBoxId 
            ? { ...box, text: selectedMove }
            : box
        )
      );
      setEditingBoxId(null);
      setEditText('');
      setSelectedMove('');
      toast.success("Move updated successfully!");
    }
  };

  const tabs = [
    { id: 'image', label: 'Image', icon: '🖼️' },
    { id: 'moves', label: 'Move Order', icon: '📝' },
    { id: 'board', label: 'Board Editor', icon: '♟️' }
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'image':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3">Image with Move Overlays</h3>
              <p className="text-sm text-gray-600 text-center">
                Click on any move box to edit it directly on the image
              </p>
            </div>
            <div ref={containerRef} className="relative inline-block max-w-full">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Analyzed"
                  className="max-w-full h-auto border rounded-lg select-none"
                />
              )}
              {boxes.map((box) => (
                <Box
                  key={box.id}
                  box={box}
                  onUpdate={handleUpdateBox}
                  onDelete={handleDeleteBox}
                  activeBoxId={activeBoxId}
                  setActiveBoxId={setActiveBoxId}
                  containerRef={containerRef}
                />
              ))}
            </div>
          </div>
        );

      case 'moves':
        return (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3">Edit Chess Moves</h3>
              <div ref={scrollContainerRef} className="space-y-2 max-h-96 overflow-y-auto">
                {boxes.map((box, index) => (
                  <div key={box.id} id={`box-${box.id}`} className="flex items-center gap-3 p-2 border rounded">
                    <span className="text-sm text-gray-500 w-16">
                      {box.text.includes('.') ? 'Move' : box.text.includes('e4') || box.text.includes('Nc3') ? 'White' : 'Black'}
                    </span>
                    
                    {editingBoxId === box.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-2 py-1 border rounded text-sm"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`flex-1 text-sm ${box.isError ? 'text-red-600 font-semibold' : 'text-gray-800'}`}>
                          {box.text}
                        </span>
                        <button
                          onClick={() => handleEditBox(box)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'board':
        return (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3">Interactive Chess Board</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a move from the list below, then make a move on the board to update it
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-3">Select Move to Edit</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {boxes.filter(box => !box.text.includes('.')).map((box, index) => {
                    const positionInfo = getCurrentPosition(boxes, box.id);
                    const moveNumber = Math.floor(positionInfo.currentMoveIndex / 2) + 1;
                    const isWhiteMove = positionInfo.isWhiteToMove;
                    
                    return (
                      <div key={box.id} className="flex items-center gap-3 p-2 border rounded">
                        <span className="text-sm text-gray-500 w-16">
                          {isWhiteMove ? 'White' : 'Black'}
                        </span>
                        <span className="text-sm text-gray-500 w-12">
                          {moveNumber}.
                        </span>
                        <span className={`flex-1 text-sm ${box.isError ? 'text-red-600 font-semibold' : 'text-gray-800'}`}>
                          {box.text}
                        </span>
                        {box.isError && (
                          <span className="text-xs text-red-500">⚠️</span>
                        )}
                        <button
                          onClick={() => {
                            setEditingBoxId(box.id);
                            setEditText(box.text);
                            setSelectedMove('');
                            console.log(`Selected move ${box.text} for editing`);
                            console.log(`Move position info:`, positionInfo);
                          }}
                          className={`text-xs px-2 py-1 rounded ${
                            editingBoxId === box.id 
                              ? 'bg-blue-700 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {editingBoxId === box.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                {editingBoxId && (
                  <div className="flex flex-col items-center">
                    {(() => {
                      const positionInfo = getCurrentPosition(boxes, editingBoxId);
                      return (
                        <>
                          <div className="mb-3 text-center">
                            <p className="text-sm text-gray-600">
                              Current position: Move {Math.floor(positionInfo.currentMoveIndex / 2) + 1}
                            </p>
                            {positionInfo.hasError && (
                              <p className="text-sm text-red-600 font-semibold">
                                ⚠️ This move has a validation error - showing previous position
                              </p>
                            )}
                          </div>
                          <InteractiveChessBoard
                            onMoveSelect={handleChessBoardMove}
                            currentPosition={positionInfo.position}
                            isWhiteToMove={positionInfo.isWhiteToMove}
                          />
                        </>
                      );
                    })()}
                    {selectedMove && (
                      <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600 mb-2">Selected move: <span className="font-semibold">{selectedMove}</span></p>
                        <button
                          onClick={handleConfirmMove}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
                        >
                          Confirm Move
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Reset editing state when switching tabs
    if (tabId !== 'moves') {
      setEditingBoxId(null);
      setEditText('');
      setSelectedMove('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Interactive Editor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-semibold text-red-800 mb-1">Validation Error:</h3>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content with Animation */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${tabs.findIndex(tab => tab.id === activeTab) * 100}%)`
              }}
            >
              {tabs.map((tab) => (
                <div key={tab.id} className="w-full flex-shrink-0">
                  {getTabContent()}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close Editor
            </button>
            <button
              onClick={() => {
                toast.info("Validation will be triggered when you close the editor");
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Validate & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveEditor;