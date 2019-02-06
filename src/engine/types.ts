export interface Point {
  x: number;
  y: number;
}

export interface Snake {
  id: string;
  name: string;
  body: Point[];
  health: number;
  color: string;
  death?: { cause: string; turn: number };
}

export interface MoveAPI {
  game: {
    id: string
  },
  turn: number;
  board: {
    height: number;
    width: number;
    food: Point[];
    snakes: Snake[]
  },
  you: Snake
}
