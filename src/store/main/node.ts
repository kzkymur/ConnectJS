import { initBaseWidth, initBaseHeight } from '@/config';
import ContentType from '@/content/types';
import { ConnectionType } from './types';

export class Node<To = any, Args extends { [arg: string]: unknown; } = any> {
  id: number;
  func: (args: Args) => void;
  name: string;
  outputs: Socket[];
  inputs: Socket[];
  output?: To;
  inputsLatestId: number;
  outputsLatestId: number;
  args: { [Key in keyof Args]?: Args[Key]; };
  readonly keys: Array<keyof Args>;
  tos: Record<number, {
    node: Node<any, any>;
    key: keyof Node['args'];
  }>;
  constructor (dummyFunc: (args: Args) => To, keys: Array<keyof Args>) {
    this.id = -1;
    this.name = '';
    this.outputs = [];
    this.inputs = [];
    this.outputsLatestId = 0;
    this.inputsLatestId = 0;
    this.keys = keys;
    this.args = {};
    this.func = dummyFunc;
    this.tos = [];
  }
  updateName (name: string) {
    this.name = name;
    return this;
  }
  set function (func: (args: Args) => To) {
    this.func = function (args: Args) {
      this.output = func(args);
      this.emit();
    };
  }
  emit (...ids: number[]) {
    let targets;
    if (ids.length === 0) targets = this.tos;
    else {
      targets = {};
      ids.forEach(id => targets[id] = {});
    };
    for (const i in targets) {
      const obj = {};
      Object.defineProperty(obj, this.tos[i].key, { value: this.output, enumerable: true, });
      this.tos[i].node.setArg(obj);
    };
  }
  setOutput (output: To) {
    this.output = output;
  }
  setArg (args: { [key in keyof Args]?: Args[key] }) {
    for (const key in args) {
      this.args[key] = args[key];
    }
    if (this.isFullArgs(this.args)) this.func!(this.args);
  }
  isFullArgs (args: { [Key in keyof Args]?: Args[Key] }): args is Args {
    for (const key of this.keys) if (args[key] === undefined) return false;
    return true;
  }
  addTos (node: ContentType, key: string) {
    if (this.tos[node.id] !== undefined) throw new Error('This node id has already been registered');
    this.tos[node.id] = { key, node };
    this.emit(node.id);
    return this;
  }
  updateTos (node: Node) {
    if (this.tos[node.id] === undefined) throw new Error('This node id has been unused');
    this.tos[node.id] = { key: this.tos[node.id].key, node };
  }
  delTos (node: Node) {
    if (this.tos[node.id] === undefined) throw new Error('This node id has been unused');
    delete this.tos[node.id];
  }
}

export class MovableNode<To = any, Args extends { [arg: string]: unknown; } = { [arg: string]: unknown; }> extends Node<To, Args> {
  top: string;
  left: string;
  constructor (dummyFunc: (args: Args) => To, keys: Array<keyof Args>) {
    super(dummyFunc, keys);
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

export class ResizableNode<To = any, Args extends { [arg: string]: unknown; } = { [arg: string]: unknown; }> extends MovableNode<To, Args> {
  width: string;
  height: string;
  constructor (dummyFunc: (args: Args) => To, keys: Array<keyof Args>) {
    super(dummyFunc, keys);
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

type Data = {
  Number: number;
}
export type DataType = Data[keyof Data];

export interface Socket {
  type: DataType;
  id: number;
  name: string;
  connection?: ConnectionType;
}
