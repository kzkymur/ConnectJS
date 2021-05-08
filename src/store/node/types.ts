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
type SocketId = number;
export interface Socket {
  type: DataType;
  id: SocketId;
  name: string;
  counterId: number;
}

type NodeId = number;
interface Node {
  id: NodeId;
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

type ConnectionId = number;
export type ConnectionType = {
  type: DataType;
  id: ConnectionId;
  iNodeId: NodeId;
  iId: SocketId;
  oNodeId: NodeId;
  oId: SocketId;
  s: Vector;
  e: Vector;
}
