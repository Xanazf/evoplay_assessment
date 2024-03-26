import { Module } from '@nestjs/common';
import { MinesweeperService } from './minesweeper.service';
import { MinesweeperController } from './minesweeper.controller';
import { GameStateService } from './gamestate.service';

@Module({
  providers: [MinesweeperService, GameStateService],
  controllers: [MinesweeperController],
})
export class MinesweeperModule {}
