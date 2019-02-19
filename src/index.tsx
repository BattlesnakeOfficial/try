import React from "react";
import ReactDOM from "react-dom";
import { Container, Grid, Button, Message } from "semantic-ui-react";
import Editor from "./Editor";
import Board from "./Board";
import * as engine from "./engine";
import * as code from "./code";
import example from './example';

import "semantic-ui-css/semantic.min.css";
import "./index.css";

interface AppState {
  code: string;
  running?: boolean;
  cancelled?: boolean;
  frame?: engine.Frame;
  error?: Error;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    code: ""
  };

  componentDidMount() {
    this.setState({
      code: localStorage.getItem("code") || example
    });
  }

  cancelled = () => !!this.state.cancelled;

  handleCodeChange = (code: string) => {
    localStorage.setItem("code", code);
    this.setState({ code });
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
  }

  run = background(async () => {
    this.setState({ cancelled: false });
    try {
      const snake = code.evaluate(this.state.code);
      await engine.run(snake, this, frame => {
        this.setState({ frame, error: undefined });
      });
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  });

  render() {
    const { error, code } = this.state;
    const frame = this.state.frame || engine.initialFrame;

    return (
      <Container fluid={true} style={{ height: 300 }}>
        <Grid style={{ height: "100%" }} divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column width={10} style={{ height: "100%" }}>
              <Editor value={code} onChange={this.handleCodeChange} />
            </Grid.Column>
            <Grid.Column width={5}>
              <Grid.Row>
                <Board
                  food={frame.food}
                  columns={frame.game.width}
                  rows={frame.game.height}
                  snakes={[frame.snake]}
                />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  {error && <Message color="red" content={error.message} />}
                  <Button onClick={this.handleStart}>Start</Button>
                  <Button onClick={this.handleStop}>Stop</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

function background(fn: () => void) {
  return () => setTimeout(fn, 0);
}

ReactDOM.render(<App />, document.getElementById("root"));
