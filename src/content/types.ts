import { Class as Canvas } from './Canvas';
import { Class as Counter } from './Counter';
import { Class as Sum } from './Sum';
import { Class as Timmer } from './Timmer';

export const Modes = {
  canvas: 'canvas',
  counter: 'counter',
  sum: 'sum',
  timmer: 'timmer',
} as const;
export type ModeType = 
  typeof Modes.canvas |
  typeof Modes.counter |
  typeof Modes.sum |
  typeof Modes.timmer;

type ContentType = Canvas | Counter | Sum | Timmer;
export default ContentType;

export const Content: { [mode in ModeType]: () => ContentType } = {
  canvas: () => { return new Canvas() },
  counter: () => { return new Counter() },
  sum: () => { return new Sum() },
  timmer: () => { return new Timmer() },
};
