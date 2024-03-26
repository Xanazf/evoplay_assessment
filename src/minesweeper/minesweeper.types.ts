interface Cell {
  id: number;
  isRevealed: boolean;
  value?: 'empty' | 'mine';
  multiplier?: number;
}

interface GameState {
  board: Cell[][];
  multiplier: number;
  size: number;
  mines: number;
  gameOver: boolean;
}

export type { Cell, GameState };
