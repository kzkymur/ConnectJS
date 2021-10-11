import { keys } from 'ts-transformer-keys';
import { ResizableNode, MovableNode } from '@/store/main/node';

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
    this.function = args => { console.log(args.number); }
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

type SumArgs = { a: number; b: number; };
export class Sum extends MovableNode<number, SumArgs> {
  readonly mode: typeof Modes.sum = Modes.sum;
  constructor () {
    super(() => 0, keys<SumArgs>());
    this.inputs = [
      {
        type: 1,
        id: 1,
        name: 'a',
      },
      {
        type: 1,
        id: 2,
        name: 'b',
      }
    ];
    this.outputs = [{
      type: 1,
      id: 1,
      name: 'sum',
    }];
    this.function = ({a, b}) => { return a + b; }
  }
}

export class Timmer extends MovableNode<number, {}> {
  readonly mode: typeof Modes.timmer = Modes.timmer;
  time: number;
  constructor () {
    super(() => 0, []);
    this.time = 0;
    this.outputs = [{
      type: 1,
      id: 1,
      name: 'timmer',
    }];
    this.function = () => { return this.time++; }
    setInterval(()=>{
      this.setArg({});
    }, 1000);
  }
}

type ContentType = Canvas | Counter | Sum | Timmer;
export default ContentType;

export const Content: { [mode in ModeType]: () => ContentType } = {
  canvas: () => { return new Canvas() },
  counter: () => { return new Counter() },
  sum: () => { return new Sum() },
  timmer: () => { return new Timmer() },
};
