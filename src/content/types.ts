import { Node, IgnitionNode } from '@/store/node/types';

export const Modes = {
  canvas: 'CANVAS',
  processor: 'PROCESSOR',
  counter: 'COUNTER',
} as const;
export type ModeType = 
  typeof Modes.canvas |
  typeof Modes.processor |
  typeof Modes.counter;

interface Canvas extends Node {
  mode: typeof Modes.canvas;
}
interface Processor extends Node {
  mode: typeof Modes.processor;
}
interface Counter extends IgnitionNode {
  mode: typeof Modes.counter;
}

type ContentType = Canvas | Processor | Counter;
export default ContentType;
