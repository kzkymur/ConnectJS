import { Node, IgnitionNode, ResizableNode } from '@/store/main/node';

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
  }
}

interface Processor extends Node {
  mode: typeof Modes.processor;
}
interface Counter extends IgnitionNode {
  mode: typeof Modes.counter;
}

type ContentType = Canvas | Processor | Counter;
export default ContentType;
