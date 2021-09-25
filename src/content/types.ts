import { keys } from 'ts-transformer-keys';
import { ResizableNode, MovableNode } from '@/store/main/node';

export const Modes = {
  canvas: 'CANVAS',
  counter: 'COUNTER',
} as const;
export type ModeType = 
  typeof Modes.canvas |
  typeof Modes.counter;

type CanvasArgs = { number: number; };
export class Canvas extends ResizableNode<void, CanvasArgs> {
  readonly mode: typeof Modes.canvas = Modes.canvas;
  constructor () {
    super(() => {}, keys<CanvasArgs>());
    this.inputs = [{
      type: 1,
      id: 1,
      name: 'canvas',
    }];
    this.function = (args) => { console.log(args.number); }
  }
}

export class Counter extends MovableNode<number, {}> {
  readonly mode: typeof Modes.counter = Modes.counter;
  counter: number;
  constructor () {
    super(() => 0, keys());
    this.counter = 0;
    this.outputs = [{
      type: 1,
      id: 1,
      name: 'counter',
    }];
    this.function = () => { return ++this.counter; }
  }
}

type ContentType = Canvas | Counter;
export default ContentType;
