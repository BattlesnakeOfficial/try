export default `
const moves = ["up", "down", "left", "right"];

function moveToPoint(head, move) {
  switch (move) {
    case "up":
      return { ...head, y: head.y - 1 };
    case "down":
      return { ...head, y: head.y + 1 };
    case "right":
      return { ...head, x: head.x + 1 };
    case "left":
      return { ...head, x: head.x - 1 };
    default:
      throw new Error("Invalid move " + move);
  }
}

function isOffBoard(board, point) {
  return (
    point.x < 0 ||
    point.y < 0 ||
    point.y >= board.height ||
    point.x >= board.width
  );
}

function isOnSnake(snake, point) {
  for (let point2 of snake.body) {
    if (point.x === point2.x && point.y === point2.y) return true;
  }
  return false;
}

function isSafe(me, board, move) {
  const point = moveToPoint(me.body[0], move);

  if (isOffBoard(board, point)) return false;

  for (let snake of board.snakes) {
    if (isOnSnake(snake, point)) return false;
  }

  return true;
}

function doMove(me, board) {
  for (let move of moves) {
    if (isSafe(me, board, move)) {
      return move;
    }
  }
  console.log("no safe move!");
  return "up";
}

function move(req) {
  console.log(req);
  return { move: doMove(req.you, req.board) };
}

function start() {
  return { color: "green" };
}
`
