import { Point, Snake, MoveAPI } from "./types";
import { Code } from "../code";
import { toUIFrame, UIFrame } from "./ui";

export interface Frame {
  width: number;
  height: number;
  turn: number;
  snake: Snake;
  food: Point[];
}

export const initialFrame: Frame = {
  turn: 1,
  width: 10,
  height: 10,
  food: [
    {
      x: 3,
      y: 2
    },
    {
      x: 1,
      y: 7
    },
    {
      x: 7,
      y: 8
    },
    {
      x: 8,
      y: 1
    }
  ],
  snake: {
    id: "test",
    name: "test",
    health: 25,
    color: "grey",
    body: [
      {
        x: 5,
        y: 5
      },
      {
        x: 5,
        y: 6
      }
    ]
  }
};

interface Canceller {
  cancelled(): boolean
}

export async function run(code: Code, canceller: Canceller, emit: (frame: UIFrame) => void) {
  const start: Frame = deepCopy(initialFrame);
  start.snake.color = code.start({}).color;

  let turn = 1;
  let frame = start;
  while (true) {
    if (canceller.cancelled()) {
      return;
    }

    frame = { ...frame, turn };
    const move = code.move(toMoveAPI(frame)).move;
    const next = moveTransform(frame, move);
    const foodIdx = ateFood(next, frame.food);

    if (foodIdx != -1) {
      // Add food to the array and leave the body intact.
      frame.food.splice(foodIdx, 1);
    } else {
      // Remove the last item from the body.
      frame.snake.body.splice(frame.snake.body.length - 1, 1);
    }
    frame.snake.body.unshift(next);

    emit(toUIFrame(toMoveAPI(frame)));

    await sleep(400);
    turn++;
  }
}

function ateFood(head: Point, food: Point[]) {
  return food.findIndex(f => f.x === head.x && f.y === head.y);
}

export class MoveError extends Error {
  turn: number;

  constructor(message: string, turn: number) {
    super(message);
    this.turn = turn;
  }
}

/**
 * Move transform takes the current snake and move and writes out a new head.
 * it will copy the current head as a base. It will throw an error if the move
 * is off the board.
 */
function moveTransform(frame: Frame, move: string): Point {
  const { snake, turn, height, width } = frame;

  const offBoard = () => {
    throw new MoveError(`Snake moved off the board!`, turn);
  };

  const head = Object.assign({}, snake.body[0]);
  switch (move) {
    case "up":
      head.y -= 1;
      if (head.y < 0) offBoard();
      break;
    case "down":
      head.y += 1;
      if (head.y >= height) offBoard();
      break;
    case "left":
      head.x -= 1;
      if (head.x < 0) offBoard();
      break;
    case "right":
      head.x += 1;
      if (head.x >= width) offBoard();
      break;
    default:
      throw new MoveError(`Unkown move "${move}"`, turn);
  }

  snake.body.forEach(part => {
    if (part.x === head.x && part.y === head.y)
      throw new MoveError(`Snake moved into itself!`, turn);
  });

  return head;
}

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

export function toMoveAPI(frame: Frame): MoveAPI {
  return {
    game: {
      id: "test"
    },
    turn: frame.turn,
    board: {
      height: frame.height,
      width: frame.width,
      food: frame.food,
      snakes: [frame.snake]
    },
    you: frame.snake
  };
}

function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
