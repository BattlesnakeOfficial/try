import { run, MoveError } from "./engine";
import { UIFrame } from './ui';

describe("engine", async () => {
  it("runs a simple game", async () => {
    const code = {
      start() {
        return { color: "#fff" };
      },
      move() {
        return { move: "up" };
      }
    };
    const canceller = {
      cancelled() {
        return false;
      }
    }

    const frames: UIFrame[] = [];
    const cb = (frame: UIFrame) => {
      frames.push(frame);
    };

    let err: MoveError;
    try {
      await run(code, canceller, cb);
    } catch (e) {
      err = e;
    }

    expect(err.message).toEqual("Snake moved up off the board!");
    expect(err.turn).toEqual(6);
  });
});
