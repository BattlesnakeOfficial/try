import { UIFrame, UISnake, toUIFrame } from './ui';
import { Point } from './types';
import { toMoveAPI, initialFrame as engineInitialFrame } from './engine';

export type Frame = UIFrame;
export type Snake = UISnake;
export type Food = Point;

export { run } from "./engine";
export const initialFrame = toUIFrame(toMoveAPI(engineInitialFrame));
