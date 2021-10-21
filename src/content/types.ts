import { Class as Canvas } from './Canvas';
import { Class as Counter } from './Counter';
import { Class as Plus } from './Plus';
import { Class as Minus } from './Minus';
import { Class as Timmer } from './Timmer';
import { Class as Multiply } from './Multiply';
import { Class as Divide } from './Divide';

export const Modes = {
  canvas: 'canvas',
  counter: 'counter',
  plus: 'plus',
  minus: 'minus',
  multiply: 'multiply',
  divide: 'divide',
  timmer: 'timmer',
} as const;
export type ModeType = 
  typeof Modes.canvas |
  typeof Modes.counter |
  typeof Modes.plus |
  typeof Modes.minus |
  typeof Modes.multiply |
  typeof Modes.divide |
  typeof Modes.timmer;

type ContentType = Canvas | Counter | Plus | Minus | Multiply | Divide | Timmer;
export default ContentType;

export const Content: { [mode in ModeType]: () => ContentType } = {
  canvas: () => { return new Canvas() },
  counter: () => { return new Counter() },
  plus: () => { return new Plus() },
  minus: () => { return new Minus() },
  multiply: () => { return new Multiply() },
  divide: () => { return new Divide() },
  timmer: () => { return new Timmer() },
};
