import { Test, TestingModule } from '@nestjs/testing';
import { MinesweeperService } from './minesweeper.service';

describe('MinesweeperService', () => {
  let service: MinesweeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinesweeperService],
    }).compile();

    service = module.get<MinesweeperService>(MinesweeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
