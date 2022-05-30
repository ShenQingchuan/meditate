type MoveDirection = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
type GameStatus = 'START' | 'WIN' | 'GOING' | 'END';

interface Game2048Data {
  historyHighest: number;
  currentScore: number;
  gameBoard?: number[][];
  status: GameStatus;
}
