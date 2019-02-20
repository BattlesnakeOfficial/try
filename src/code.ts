export interface Code {
  move: (req: any) => { move: string };
  start: (req: any) => { color: string };
}

/**
 * Code evaluates code and turns it into two functions that can be called.
 */
export function evaluate(code: string): Code {
  const callable = new Function(`${code};\n return { move: move, start: start }`)()
  return callable;
}
