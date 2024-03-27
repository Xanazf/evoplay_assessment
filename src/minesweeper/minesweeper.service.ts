import { Injectable } from '@nestjs/common';
import { Cell } from './minesweeper.types';
import { GameStateService } from './gamestate.service';

@Injectable()
export class MinesweeperService {
  private board: Cell[][];
  // 5, 7, 8
  private size: number;
  private mines: number;
  private multiplier: number;
  private gameOver: boolean;
  private size_multiplier: number; // house edge
  private mine_multiplier: number; // losing probability

  constructor(private readonly gameStateService: GameStateService) {
    // default game state
    this.size = 5;
    this.mines = 3;
    this.size_multiplier = 0.95;
    this.mine_multiplier = 0.94;
    this.multiplier = 0;
    this.gameOver = false;

    // initial game save (redundant?)
    const gameState = this.gameStateService.loadGameState();
    if (!gameState) {
      const initialBoard = this.initializeBoard();
      this.gameStateService.saveGameState({
        board: initialBoard,
        multiplier: this.multiplier,
        size: this.size,
        mines: this.mines,
        gameOver: false,
      });
    }
  }

  resetGame(
    size: number,
    mines: number,
    size_multiplier: number,
    mine_multiplier: number,
  ) {
    this.size = size;
    this.mines = mines;
    this.size_multiplier = size_multiplier;
    this.mine_multiplier = mine_multiplier;
    this.multiplier = 0;
    this.gameOver = false;
    this.board = this.initializeBoard();
    this.gameStateService.saveGameState({
      board: this.board,
      multiplier: this.multiplier,
      size: this.size,
      mines: this.mines,
      gameOver: false,
    });
  }

  private multiplierFormula(bet: number): number {
    // const true_size = this.size * this.size;
    // const winning_probability = (true_size - this.mines) / true_size; // reverse of the mine_multiplier, doesn't recalculate empty cells

    const total_multiplier =
      bet * this.mine_multiplier * 10 * this.size_multiplier; // (bet/winning_probability) * house edge || (bet*mine_multiplier*10) * house edge
    return total_multiplier;
  }

  private initializeBoard(): Cell[][] {
    this.gameOver = false;
    const board: Cell[][] = [];
    let id = 1;
    for (let row = 0; row < this.size; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < this.size; col++) {
        rowCells.push({
          id: id++,
          isRevealed: false,
          value: 'empty',
          multiplier: 0,
        });
      }
      board.push(rowCells);
    }

    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const row = Math.floor(Math.random() * this.size);
      const col = Math.floor(Math.random() * this.size);
      if (board[row][col].value !== 'mine') {
        board[row][col].value = 'mine';
        minesPlaced++;
      }
    }

    return board;
  }

  getBoard(hidden: boolean): Cell[][] {
    const board = this.gameStateService.loadGameState().board;
    if (!hidden || this.gameOver === true) {
      return board;
    }
    const hiddenBoard = board.map((row) => {
      return row.map((cell) => {
        if (cell.isRevealed) {
          return cell;
        }
        return {
          id: cell.id,
          isRevealed: cell.isRevealed,
        };
      });
    });

    return hiddenBoard;
  }

  reveal(row: number, col: number, bet: number): Cell {
    if (this.gameOver) {
      throw new Error('Game lost');
    }

    const cell = this.board[row - 1][col - 1];
    if (!cell.isRevealed) {
      cell.isRevealed = true;
      if (cell.value === 'mine') {
        this.multiplier = 0;
        this.gameOver = true;
        this.gameStateService.saveGameState({
          board: this.board,
          multiplier: this.multiplier,
          size: this.size,
          mines: this.mines,
          gameOver: this.gameOver,
        });
        return cell;
      }
      cell.multiplier = this.multiplierFormula(bet);
      this.multiplier += cell.multiplier;
      const true_size = this.size * this.size;
      const revealed = this.gameStateService
        .loadGameState()
        .board.map((row) => {
          return row.filter((cell) => cell.isRevealed);
        })
        .flat();
      this.mine_multiplier = this.mines / (true_size - revealed.length);
    }
    this.gameStateService.saveGameState({
      board: this.board,
      multiplier: this.multiplier,
      size: this.size,
      mines: this.mines,
      gameOver: this.gameOver,
    });
    return cell;
  }

  getWin(): number {
    if (this.gameOver === true) {
      return 0;
    }
    this.gameOver = true;
    this.gameStateService.saveGameState({
      board: this.board,
      multiplier: this.multiplier,
      size: this.size,
      mines: this.mines,
      gameOver: this.gameOver,
    });
    console.log(this.gameStateService.loadGameState().multiplier);
    return this.gameStateService.loadGameState().multiplier;
  }
}
