import Vector from '@/utils/vector';
import { DataType, } from './node';

export type ConnectionType = {
  type: DataType;
  id: number;
  fromNodeId: number;
  fromSocketId: number;
  toNodeId: number;
  toSocketId: number;
  s: Vector;
  e: Vector;
}
