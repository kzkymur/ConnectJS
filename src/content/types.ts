import { Node, ResizableNode, MovableNode } from '@/store/main/node';

export const Modes = {
  canvas: 'CANVAS',
  processor: 'PROCESSOR',
  counter: 'COUNTER',
} as const;
export type ModeType = 
  typeof Modes.canvas |
  typeof Modes.processor |
  typeof Modes.counter;

export class Canvas extends ResizableNode {
  constructor () {
    super(Modes.canvas);
    this.inputs = [{
      type: 1,
      id: 1,
      name: 'canvas',
    }]
  }
}

interface Processor extends Node {
  mode: typeof Modes.processor;
}
export class Counter extends MovableNode {
  constructor () {
    super(Modes.counter);
    this.outputs = [{
      type: 1,
      id: 1,
      name: 'counter',
    }]
  }
}

type ContentType = Canvas | Processor | Counter;
export default ContentType;
