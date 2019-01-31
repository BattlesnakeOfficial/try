import React from "react";
import ReactDOM from "react-dom";
import { Container, Grid, Button, Message } from "semantic-ui-react";
import Editor from "./Editor";
import Board from "./Board";
import * as engine from "./engine";
import * as code from "./code";

import "semantic-ui-css/semantic.min.css";
import "./index.css";

interface AppState {
  code: string;
  frame?: engine.Frame;
  error?: Error;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    code: ""
  };

  componentDidMount() {
    this.setState({
      code: localStorage.getItem("code") || ""
    });
  }

  handleCodeChange = (code: string) => {
    localStorage.setItem("code", code);
    this.setState({ code });
  };

  handleStart = () => {
    setTimeout(async () => {
      try {
        await engine.run(code.evaluate(this.state.code), frame => {
          this.setState({ frame, error: undefined });
        });
      } catch (error) {
        this.setState({ error });
      }
    }, 0);
  };

  render() {
    const { frame, error, code } = this.state;
    return (
      <Container fluid={true} style={{ height: "100%" }}>
        <Grid style={{ height: "100%" }} divided="vertically">
          <Grid.Row columns={3}>
            <Grid.Column>
              <p>Left</p>
            </Grid.Column>
            <Grid.Column style={{ height: "100%" }}>
              <Editor value={code} onChange={this.handleCodeChange} />
            </Grid.Column>
            <Grid.Column>
                <Board
                  food={frame ? frame.food : []}
                  columns={engine.defaultGame.width}
                  rows={engine.defaultGame.height}
                  snakes={frame ? [frame.snake] : []}
                />
              {error && <Message color="red" content={error.message} />}
              <Button onClick={this.handleStart}>Start</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
