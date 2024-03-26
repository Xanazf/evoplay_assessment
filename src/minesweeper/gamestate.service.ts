import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { GameState } from './minesweeper.types';

@Injectable()
export class GameStateService {
  private readonly gameStateFile = 'game-state.json';

  saveGameState(state: GameState) {
    fs.writeFileSync(this.gameStateFile, JSON.stringify(state));
  }

  loadGameState(): GameState {
    if (!fs.existsSync(this.gameStateFile)) {
      return null;
    }
    const gameState = JSON.parse(fs.readFileSync(this.gameStateFile, 'utf-8'));
    return gameState;
  }
}
