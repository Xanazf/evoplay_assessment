import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinesweeperModule } from './minesweeper/minesweeper.module';

@Module({
  imports: [MinesweeperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
