import { MoveAPI, Snake as SnakeAPI, Point } from './types';

export interface UISnakePoint {
  x: number;
  y: number;
  type: string;
  shouldRender: boolean;
  direction: string;
}

export interface UISnake {
  _id: string;
  color: string;
  body: UISnakePoint[];
  name: string;
  health: number;
  isDead: boolean;
  death?: { cause: string; turn: number };
}

export interface UIFrame {
  turn: number;
  game: {
    width: number;
    height: number;
  };
  snake: UISnake;
  food: Point[];
}

export function toUIFrame(move: MoveAPI): UIFrame {
  return {
    turn: move.turn,
    game: {
      width: move.board.width,
      height: move.board.height,
    },
    snake: {
      _id: move.you.id,
      color: move.you.color,
      name: move.you.name,
      health: move.you.health,
      isDead: !!move.you.death,
      death: move.you.death,
      body: move.you.body.map((_, idx) => formatBody(move.you, idx))
    },
    food: move.board.food,
  }
}

function formatBody(snake: SnakeAPI, partIdx: number): UISnakePoint {
  const part = snake.body[partIdx];
  const next = snake.body[partIdx - 1];
  return {
    ...part,
    direction: next ? getDirection(part, next) : headDirection(snake),
    shouldRender: !isCovered(snake, partIdx),
    type: getType(snake, partIdx)
  };
}

function getDirection(a: Point, b: Point) {
  if (a.x < b.x) {
    return "right";
  } else if (b.x < a.x) {
    return "left";
  } else if (a.y < b.y) {
    return "down";
  }
  return "up";
}

function headDirection(snake: SnakeAPI) {
  return snake.body.length > 1
    ? getDirection(snake.body[1], snake.body[0])
    : "up";
}

function isCovered(snake: SnakeAPI, partIndex: number) {
  const part = snake.body[partIndex];
  const next = snake.body[partIndex - 1];

  return next && next.x === part.x && next.y === part.y;
}

function getType(snake: SnakeAPI, partIndex: number) {
  if (partIndex === 0) {
    return "head";
  }

  if (partIndex === snake.body.length - 1) {
    return "tail";
  }

  return "body";
}
