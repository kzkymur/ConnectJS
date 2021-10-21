import { initBaseWidth, initBaseHeight } from '@/config';
import { ConnectionType } from './types';

export class Node<To extends { [arg: string]: unknown; } = any, Args extends { [arg: string]: unknown; } = any> {
  id: number;
  func: (args: Args) => void;
  name: string;
  inputs: Sockets<Args>;
  outputs: OutputSockets<To>;
  inputsLatestId: number;
  outputsLatestId: number;
  args: { [Key in keyof Args]?: Args[Key]; };
  readonly inputKeys: Array<keyof Args>;
  readonly outputKeys: Array<keyof To>;
  value: To;
  rerender: () => void;
  constructor (inputKeys: Array<keyof Args>, outputKeys: Array<keyof To>) {
    this.id = -1;
    this.name = '';
    const inputs: any = {};
    inputKeys.forEach((key, i)=>{ inputs[key] = { id: i }; });
    this.inputs = inputs;
    const outputs: any = {};
    outputKeys.forEach((key, i)=>{ outputs[key] = { id: i, connections: [] }; });
    this.outputs = outputs;
    this.outputsLatestId = 0;
    this.inputsLatestId = 0;
    this.inputKeys = inputKeys;
    this.outputKeys = outputKeys;
    this.args = {};
    this.func =  (() => 0) as any as (args: Args) => To;
    this.value = {} as To;
    this.rerender = () => {};
  }
  updateName (name: string) {
    this.name = name;
    return this;
  }
  set function (func: (args: Args) => To) {
    this.func = function (args: Args) {
      const outputs = func(args);
      console.log(outputs);
      if (outputShallowEqual(this.outputs, outputs)) return;
      this.outputsObj = outputs;
      this.rerender();
      this.emit();
    };
  }
  set outputsObj (outputs: To) {
    const value: Partial<To> = {};
    for (const key of this.outputKeys) {
      this.outputs[key].value = outputs[key];
      value[key] = this.outputs[key].value;
    }
    this.value = value as To;
  }
  emit (outputKey?: keyof To, ...ids: string[]) {
    for (const key of (outputKey !== undefined ? [outputKey] : this.outputKeys)) {
      const keys = ids.length === 0 ? Object.keys(this.outputs[key].connections) : [...ids];
      for (const id of keys) {
        const obj = {};
        Object.defineProperty(obj, this.outputs[key].connections[id].toSocketKey, { value: this.outputs[key].value, enumerable: true, });
        console.log(this.outputs[key].connections);
        console.log(obj);
        const to = this.outputs[key].connections[id].to;
        if (to === undefined) throw new Error(`connection ${id} has no toNode`);
        to.arg = obj;
      }
    }
  }
  set arg (args: { [key in keyof Args]?: Args[key] }) {
    for (const key in args) {
      this.args[key] = args[key];
    }
    if (this.isFullArgs(this.args)) this.func!(this.args);
  }
  isFullArgs (args: { [Key in keyof Args]?: Args[Key] }): args is Args {
    for (const key of this.inputKeys) if (args[key] === undefined) return false;
    return true;
  }
  addTos (connection: ConnectionType) {
    const id = stringId(connection.to.id, connection.toSocketKey);
    const key = connection.fromSocketKey;
    if (this.outputs[key].connections[id] !== undefined)
      throw new Error(`This connection where toNodeId = ${connection.to.id} and toSocketKey = ${connection.toSocketKey} has already been registered`);
    this.outputs[key].connections[id] = connection;
    this.emit(key, id);
    return this;
  }
  updateTos (connection: ConnectionType) {
    const id = stringId(connection.to.id, connection.toSocketKey);
    const key = connection.fromSocketKey;
    if (this.outputs[key].connections[id] === undefined)
      throw new Error(`This connection where toNodeId = ${connection.to.id} and toSocketKey = ${connection.toSocketKey} has been unused`);
    this.outputs[key].connections[id] = connection;
    return this;
  }
  delTos (key: string, id: number) {
    const strid = stringId(id, key);
    if (this.outputs[key].connections[strid] === undefined)
      throw new Error(`This connection where stringId = ${strid} has been unused`);
    delete this.outputs[key].connections[strid];
    return this;
  }
}

export class MovableNode<To extends { [arg: string]: unknown; } = any, Args extends { [arg: string]: unknown; } = any> extends Node<To, Args>{
  top: string;
  left: string;
  constructor (inputKeys: Array<keyof Args>, outputKeys: Array<keyof To>) {
    super(inputKeys, outputKeys);
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

export class ResizableNode<To extends { [arg: string]: unknown; } = any, Args extends { [arg: string]: unknown; } = any> extends MovableNode<To, Args>{
  width: string;
  height: string;
  constructor (inputKeys: Array<keyof Args>, outputKeys: Array<keyof To>) {
    super(inputKeys, outputKeys);
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

type Data = { Number: number; };
export type DataType = Data[keyof Data];
export type Sockets<Obj extends Record<string, any> = Record<string, any>> = { [Key in keyof Obj]: Obj[Key]; };
export type OutputSockets<Obj> = {
  [Key in keyof Obj]: {
    value: Obj[Key];
    connections: Record<string, ConnectionType>;
  };
};

const stringId = (a: number, b: string) => `${a}-${b}`;
const outputShallowEqual = <To>(outputSockets: OutputSockets<To>, output: To) => {
  for (const key in output) {
    if (outputSockets[key].value !== output[key]) return false;
  }
  return true;
}
