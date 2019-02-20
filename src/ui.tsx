import * as React from "react";

const styles = {
  row: { display: "flex", padding: 0, margin: 0 },
  col: { flex: 1 },
  button: {
    background: "none",
    color: "inherit",
    border: "none",
    padding: "0.5em",
    font: "inherit",
    cursor: "pointer",
    outline: "inherit"
  }
};

export const Row = ({
  children,
  className,
  style
}: {
  children: any;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={className} style={{ ...styles.row, ...style }}>
    {children}
  </div>
);

export const Col = ({
  flex,
  className,
  children,
  style
}: {
  style?: React.CSSProperties;
  className?: string;
  flex?: number;
  children: any;
}) => (
  <div
    className={className}
    style={{ flex: flex || 1, ...styles.col, ...style }}
  >
    {children}
  </div>
);

export const Button = (props: { onClick?: any; children?: any }) => (
  <button {...props} style={styles.button}>
    {props.children}
  </button>
);
