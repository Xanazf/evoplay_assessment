import { Controller, Get, Post, Body } from '@nestjs/common';
import { MinesweeperService } from './minesweeper.service';
import { Cell } from './minesweeper.types';

const MinesweeperConfig = (size: number, mines: number) => {
  let size_mult: number;
  const mines_mult: number = (mines / size) * 100 * 0.01;

  switch (size) {
    case 5:
      size_mult = 0.9;
      break;
    case 7:
      size_mult = 0.92;
      break;
    case 8:
      size_mult = 0.93;
      break;

    default:
      size_mult = 0.95;
      break;
  }
  return {
    size: size,
    mines: mines,
    size_mult: size_mult,
    mines_mult: mines_mult,
  };
};

@Controller('minesweeper')
export class MinesweeperController {
  constructor(private readonly minesweeperService: MinesweeperService) {}

  @Post('newgame')
  newGame(@Body('size') size: number, @Body('mines') mines: number) {
    if (
      size === (5 || 7 || 8) &&
      mines <= (5 * 5 - 1 || 7 * 7 - 1 || 8 * 8 - 1)
    ) {
      const config = MinesweeperConfig(size, mines);
      this.minesweeperService.resetGame(
        config.size,
        config.mines,
        config.size_mult,
        config.mines_mult,
      );
      return { message: 'New game started' };
    }
    return { message: 'Wrong game parameters' };
  }

  @Post('placebet')
  reveal(
    @Body('row') row: number,
    @Body('col') col: number,
    @Body('bet') bet: number,
  ): Cell | { message: string } {
    try {
      return this.minesweeperService.reveal(row, col, bet);
    } catch {
      return { message: 'Game lost' };
    }
  }

  @Get('currentgame')
  getBoard(): Cell[][] {
    return this.minesweeperService.getBoard(true);
  }

  @Post('cashout')
  cashOut(): { message: string } {
    const winnings = this.minesweeperService.getWin();
    if (winnings !== 0) {
      return {
        message: `Your winnings are: ${winnings}`,
      };
    }
    return { message: 'No winnings.' };
  }
}
