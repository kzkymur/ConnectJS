import Vector from '@/utils/vector';
import { DataType, } from './node';

type ConnectionId = number;
export type ConnectionType = {
  type: DataType;
  id: ConnectionId;
  iNodeId: number;
  iId: number;
  oNodeId: number;
  oId: number;
  s: Vector;
  e: Vector;
}
