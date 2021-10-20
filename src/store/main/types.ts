import Vector from '@/utils/vector';
import { DataType, } from './node';
import ContentType from '@/content/types';

export type ConnectionType = {
  type: DataType;
  id: number;
  s: Vector;
  e: Vector;
  to: ContentType;
  toSocketKey: string;
  fromNodeId: number;
  fromSocketKey: string;
};

type fromInfo = {
  s: Vector;
  fromNodeId: number;
  fromSocketKey: string;
};
type toInfo = {
  e: Vector;
  to: ContentType;
  toSocketKey: string;
};
export type NewConnectionInfo = {
  id: number;
  type: DataType;
} & (
  ({ status: typeof connectionInfoStatus.incomplete; } & (fromInfo | toInfo)) |
  ({ status: typeof connectionInfoStatus.complete; } & fromInfo & toInfo)
);
export const connectionInfoStatus = {
  incomplete: "incomplete",
  complete: "complete",
} as const;
