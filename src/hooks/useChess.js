import { useContext } from 'react';
import { ChessContext } from '../contexts/ChessContext';

export const useChess = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error('useChess must be used within a ChessProvider');
  }
  return context;
};