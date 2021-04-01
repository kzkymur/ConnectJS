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
}
interface Canvas extends Node {

};
interface Processor extends Node {

};
export type Content = Canvas | Processor;

export type Contents = Content[];

export type ConnectionType = {
  type: DataType;
  id: number;
  iBaseId: number;
  iId: number;
  oBaseId: number;
  oId: number;
  s: Vector;
  e: Vector;
}
