import { Code } from "./code";

export interface SnakeBody {
  x: number;
  y: number;
  type: string;
  shouldRender: boolean;
  direction: string;
}

export interface Snake {
  _id: string;
  color: string;
  body: SnakeBody[];
  name: string;
  health: number;
  isDead: boolean;
  death?: { cause: string; turn: number };
}

export interface Food {
  x: number;
  y: number;
}

export interface Game {
  width: number;
  height: number;
}

export interface Frame {
  turn: number;
  game: Game;
  snake: Snake;
  food: Food[];
}

export const defaultGame: Game = {
  width: 10,
  height: 10
};

export async function run(code: Code, emit: (frame: Frame) => void) {
  const color = code.start({}).color;
  const start: Frame = {
    turn: 1,
    game: defaultGame,
    food: [
      {
        x: 3,
        y: 2
      },
      {
        x: 4,
        y: 2
      },
      {
        x: 5,
        y: 2
      },
      {
        x: 6,
        y: 2
      }
    ],
    snake: {
      _id: "test",
      name: "test",
      health: 25,
      isDead: false,
      color,
      body: [
        {
          x: 5,
          y: 5,
          type: "head",
          shouldRender: true,
          direction: "up"
        },
        {
          x: 5,
          y: 6,
          type: "tail",
          shouldRender: true,
          direction: ""
        }
      ]
    }
  };

  let turn = 1;
  let frame = start;
  while (turn <= 100) {
    frame = { ...frame, turn };
    const move = code.move({}).move;
    const next = moveTransform(frame.snake, turn, frame.game, move);
    const foodIdx = ateFood(next, frame.food);

    if (foodIdx != -1) {
      // Add food to the array and leave the body intact.
      frame.food.splice(foodIdx, 1);
      frame.food.push({ x: 3, y: 2 });
    } else {
      // Remove the last item from the body.
      frame.snake.body.splice(frame.snake.body.length - 1, 1);
    }
    frame.snake.body.unshift(next);

    frame.snake.body = frame.snake.body.map((part, idx) =>
      formatBody(frame.snake, idx)
    );

    console.log(frame);
    emit(frame);

    await sleep(300);
    turn++;
  }
}

function ateFood(head: SnakeBody, food: Food[]) {
  return food.findIndex(f => f.x === head.x && f.y === head.y);
}

export class MoveError extends Error {
  turn: number;

  constructor(message: string, turn: number) {
    super(message);
    this.turn = turn;
  }
}

function moveTransform(
  snake: Snake,
  turn: number,
  game: Game,
  move: string
): SnakeBody {
  const offBoard = () => {
    throw new MoveError(`Snake moved ${move} off the board!`, turn);
  };

  const head = Object.assign({}, snake.body[0]);
  switch (move) {
    case "up":
      head.y -= 1;
      if (head.y < 0) offBoard();
      break;
    case "down":
      head.y += 1;
      if (head.y >= game.height) offBoard();
      break;
    case "left":
      head.x -= 1;
      if (head.x < 0) offBoard();
      break;
    case "right":
      head.x += 1;
      if (head.x >= game.width) offBoard();
      break;
    default:
      throw new MoveError(`Unkown move "${move}"`, turn);
  }

  snake.body.forEach(part => {
    if (part.x === head.x && part.y === head.y)
      throw new MoveError(`Snake moved ${move} into itself!`, turn);
  });

  return head;
}

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

function formatBody(snake: Snake, partIdx: number): SnakeBody {
  const part = snake.body[partIdx];
  const next = snake.body[partIdx - 1];
  return {
    ...part,
    direction: next ? getDirection(part, next) : headDirection(snake),
    shouldRender: !isCovered(snake, partIdx),
    type: getType(snake, partIdx)
  };
}

function getDirection(a: SnakeBody, b: SnakeBody) {
  if (a.x < b.x) {
    return "right";
  } else if (b.x < a.x) {
    return "left";
  } else if (a.y < b.y) {
    return "down";
  }
  return "up";
}

function headDirection(snake: Snake) {
  return snake.body.length > 1
    ? getDirection(snake.body[1], snake.body[0])
    : "up";
}

function isCovered(snake: Snake, partIndex: number) {
  const part = snake.body[partIndex];
  const next = snake.body[partIndex - 1];

  return next && next.x === part.x && next.y === part.y;
}

function getType(snake: Snake, partIndex: number) {
  if (partIndex === 0) {
    return "head";
  }

  if (partIndex === snake.body.length - 1) {
    return "tail";
  }

  return "body";
}
