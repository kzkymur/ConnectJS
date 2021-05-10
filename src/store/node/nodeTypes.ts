import { Node, IgnitionNode } from './types';

export const NodeModes = {
  canvas: 'CANVAS',
  processor: 'PROCESSOR',
  counter: 'COUNTER',
} as const;
export type NodeModeType = 
  typeof NodeModes.canvas |
  typeof NodeModes.processor |
  typeof NodeModes.counter;

interface Canvas extends Node {
  mode: typeof NodeModes.canvas;
}
interface Processor extends Node {
  mode: typeof NodeModes.processor;
}
interface Counter extends IgnitionNode {
  mode: typeof NodeModes.counter;
}

type NodeType = Canvas | Processor | Counter;
export default NodeType;
