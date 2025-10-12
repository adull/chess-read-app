import { Chess } from 'chess.js';

export const getCurrentPosition = (boxes, targetBoxId) => {
  const chess = new Chess();
  
  // Sort boxes by position (top, then left)
  const sorted = [...boxes].sort((a, b) => a.top - b.top || a.left - b.left);
  
  // Group into triples: [moveNum, white, black]
  const moves = [];
  for (let i = 0; i < sorted.length; i += 3) {
    const moveNum = sorted[i];
    const whiteBox = sorted[i + 1];
    const blackBox = sorted[i + 2];
    if (!moveNum) continue;
    moves.push({ moveNum, whiteBox, blackBox });
  }

  // Find the target box and determine which move we're editing
  const targetBox = boxes.find(box => box.id === targetBoxId);
  if (!targetBox) return { position: null, isWhiteToMove: true };

  // Determine if it's a white or black move
  const isWhiteMove = !targetBox.text.includes('.') && 
    (targetBox.text.includes('e4') || targetBox.text.includes('Nc3') || 
     targetBox.text.includes('Bc4') || targetBox.text.includes('Nf3') ||
     targetBox.text.includes('d4') || targetBox.text.includes('O-O') ||
     targetBox.text.includes('Q') || targetBox.text.includes('R') ||
     targetBox.text.includes('K') || targetBox.text.includes('B') ||
     targetBox.text.includes('N') || targetBox.text.includes('P') ||
     /^[a-h]/.test(targetBox.text));

  // Apply moves up to the current position
  let currentMoveIndex = -1;
  let foundTargetMove = false;
  
  for (let i = 0; i < moves.length; i++) {
    const { whiteBox, blackBox } = moves[i];
    
    // Check if we're editing this move
    if (whiteBox?.id === targetBoxId || blackBox?.id === targetBoxId) {
      foundTargetMove = true;
      break;
    }
    
    // Apply white move if it exists and is valid
    if (whiteBox?.text) {
      try {
        chess.move(whiteBox.text);
        currentMoveIndex = i * 2;
      } catch (error) {
        // If we can't make the move, stop here
        console.log(`Error applying white move ${whiteBox.text}:`, error.message);
        break;
      }
    }
    
    // Apply black move if it exists and is valid
    if (blackBox?.text) {
      try {
        chess.move(blackBox.text);
        currentMoveIndex = i * 2 + 1;
      } catch (error) {
        // If we can't make the move, stop here
        console.log(`Error applying black move ${blackBox.text}:`, error.message);
        break;
      }
    }
  }

  // If the target move has a validation error, go to the previous position
  if (foundTargetMove && targetBox.isError) {
    console.log(`Target move ${targetBox.text} has validation error, staying at previous position`);
  }

  return {
    position: chess.fen(),
    isWhiteToMove: isWhiteMove,
    currentMoveIndex,
    foundTargetMove,
    hasError: targetBox.isError
  };
};
