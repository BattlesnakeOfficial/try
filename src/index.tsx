import React from "react";
import ReactDOM from "react-dom";
import { Row, Col, Button } from "./ui";
import Editor from "./Editor";
import Board from "./Board";
import * as engine from "./engine";
import * as code from "./code";
import example from "./example";

import "./index.css";
import "normalize.css";

const styles: { [k: string]: React.CSSProperties } = {
  controls: {
    textAlign: "center"
  },
  editor: { height: 352 },
  board: { height: 352 },
  error: {
    textAlign: "center",
    color: "red",
    height: "1.8em"
  }
};

interface AppState {
  code: string;
  running?: boolean;
  cancelled?: boolean;
  frame: engine.Frame;
  error?: Error;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    code: example,
    frame: engine.initialFrame
  };

  cancelled = () => !!this.state.cancelled;

  handleCodeChange = (code: string) => {
    localStorage.setItem("code", code);
    this.setState({ code });
  };

  handleReset = () => {
    this.setState({
      cancelled: true,
      running: false,
      frame: engine.initialFrame
    });
  };

  handleStop = () => {
    this.setState({ cancelled: true, running: false });
  };

  handleStart = () => {
    if (this.state.running) {
      return;
    }
    this.setState({ running: true });
    this.run();
  };

  run = background(async () => {
    this.setState({ cancelled: false });
    try {
      const snake = code.evaluate(this.state.code);
      await engine.run(snake, this, frame => {
        this.setState({ frame, error: undefined });
      });
      this.setState({ running: false });
    } catch (error) {
      console.log(error);
      this.setState({ error, running: false });
    }
  });

  render() {
    const { error, code, running, frame } = this.state;

    return (
      <Row className="board-row">
        <Col style={styles.editor}>
          <Editor value={code} onChange={this.handleCodeChange} />
        </Col>
        <Col style={styles.board}>
          <Row>
            <Col style={styles.error}>
              <span>{error ? error.message : ""}</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <Board
                food={frame.food}
                columns={frame.game.width}
                rows={frame.game.height}
                snakes={[frame.snake]}
              />
            </Col>
          </Row>
          <Row>
            <Col style={styles.controls}>
              {!running && <Button onClick={this.handleStart}>Play</Button>}
              {running && <Button onClick={this.handleStop}>Pause</Button>}
              <Button onClick={this.handleReset}>Reset</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

function background(fn: () => void) {
  return () => setTimeout(fn, 0);
}

ReactDOM.render(<App />, document.getElementById("root"));
