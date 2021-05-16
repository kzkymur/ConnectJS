import Vector from '@/utils/vector';
import { ModeType } from '@/content/types';

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
export type NodeFunc = (...args: DataType[]) => DataType[];
export interface Node {
  id: NodeId;
  name: string;
  mode: ModeType;
  width: string;
  height: string;
  top: string;
  left: string;
  outputs: Socket[];
  inputs: Socket[];
  inputsLatestId: number;
  outputsLatestId: number;
  func: NodeFunc;
}
export interface IgnitionNode extends Node {
  runEngine: () => void;
}

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
