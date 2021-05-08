import Vector from '@/utils/vector';

export const NodeModeNames = {
  Code: 'CODE',
  Canvas: 'CANVAS',
} as const;
interface CodeMode { name: typeof NodeModeNames.Code }
interface CanvasMode { name: typeof NodeModeNames.Canvas } 
export type NodeMode = CodeMode | CanvasMode;

export const DataTypes = {
  Number: 'NUMBER',
  NumberList: 'NUMBER_LIST',
  Framebuffer: 'FRAMEBUFFER',
} as const;
export type DataType = typeof DataTypes.Number | typeof DataTypes.NumberList | typeof DataTypes.Framebuffer;
export interface Socket {
  type: DataType;
  id: number;
  name: string;
  counterId: number;
}

interface Node {
  id: number;
  name: string;
  mode: NodeMode;
  width: string;
  height: string;
  top: string;
  left: string;
  outputs: Socket[];
  inputs: Socket[];
  inputsLatestId: number;
  outputsLatestId: number;
  func: (...args: DataType[]) => (DataType[] | void);
}
interface Canvas extends Node {

};
interface Processor extends Node {

};
export type NodeType = Canvas | Processor;

export type ConnectionType = {
  type: DataType;
  id: number;
  iNodeId: number;
  iId: number;
  oNodeId: number;
  oId: number;
  s: Vector;
  e: Vector;
}
