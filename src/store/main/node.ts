import { ModeType, } from '@/content/types';
import { initBaseWidth, initBaseHeight } from '@/config';

export class Node {
  id: number;
  name: string;
  mode: ModeType;
  outputs: Socket[];
  inputs: Socket[];
  inputsLatestId: number;
  outputsLatestId: number;
  constructor (mode: ModeType) {
    this.id = -1;
    this.name = '';
    this.mode = mode;
    this.outputs = [];
    this.inputs = [];
    this.outputsLatestId = 0;
    this.inputsLatestId = 0;
  }
  updateName (name: string) {
    this.name = name;
    return this;
  }
}

export class MovableNode extends Node {
  top: string;
  left: string;
  constructor (mode: ModeType) {
    super(mode);
    this.top = `${String(40 + 20 * Math.random())}%`;
    this.left = `${String(40 + 20 * Math.random())}%`;
  }
  updatePos (top: string, left: string) {
    this.top = top;
    this.left = left;
    return this;
  }
}
export function isMovable (arg: Node): arg is MovableNode {
  return arg instanceof MovableNode;
}

export class ResizableNode extends MovableNode {
  width: string;
  height: string;
  constructor (mode: ModeType) {
    super(mode);
    this.width = `${initBaseWidth}px`;
    this.height = `${initBaseHeight}px`;
  }
  updateSize (width: string, height: string) {
    this.width = width;
    this.height = height;
    return this;
  }
}
export function isResizable (arg: Node): arg is ResizableNode {
  return arg instanceof ResizableNode;
}

export interface IgnitionNode extends Node {
  runEngine: () => void;
}

type Data = {
  Number: number;
}
export type DataType = Data[keyof Data];

export interface Socket {
  type: DataType;
  id: number;
  name: string;
  counterId: number;
}
