import { run, Frame, MoveError } from "./engine";

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
    const frames: Frame[] = [];
    const cb = (frame: Frame) => {
      frames.push(frame);
    };

    let err: MoveError;
    try {
      await run(code, cb);
    } catch (e) {
      err = e;
    }

    expect(err.message).toEqual("Snake off board!");
    expect(err.turn).toEqual(6);
  });
});
