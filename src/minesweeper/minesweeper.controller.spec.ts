import { Test, TestingModule } from '@nestjs/testing';
import { MinesweeperController } from './minesweeper.controller';

describe('MinesweeperController', () => {
  let controller: MinesweeperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinesweeperController],
    }).compile();

    controller = module.get<MinesweeperController>(MinesweeperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
