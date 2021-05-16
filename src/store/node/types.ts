import Vector from '@/utils/vector';
import { ModeType } from '@/content/types';

export const DataTypes = {
  Number: 'NUMBER',
  NumberList: 'NUMBER_LIST',
  Framebuffer: 'FRAMEBUFFER',
} as const;

type Data = {
  Number: number;
}
export type DataType = typeof DataTypes.Number | typeof DataTypes.NumberList | typeof DataTypes.Framebuffer | Data[keyof Data];

const a: DataType = 12;

type SocketId = number;
export interface Socket {
  type: DataType;
  id: SocketId;
  name: string;
  counterId: number;
}

type NodeId = number;
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
