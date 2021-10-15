import { Action } from 'redux';
import NodeAction from '../main/actionTypes';

export const ActionTypes = {
  undo: "UNDO",
  redo: "REDO",
  mult: "MULT",

  branch: "BRANCH",
  forward: "FORWARD",
  backward: "BACKWARD",
  store: "STORE",
} as const;

interface Undo extends Action { type: typeof ActionTypes.undo; }
interface Redo extends Action { type: typeof ActionTypes.redo; }

export type MultArray = (NodeAction | Mult)[];
export interface Mult extends Action {
  type: typeof ActionTypes.mult;
  payload: MultArray;
}

interface Branch extends Action { type: typeof ActionTypes.branch; }
interface Forward extends Action { type: typeof ActionTypes.forward; }
interface Backward extends Action { type: typeof ActionTypes.backward; }
interface Store extends Action {
  type: typeof ActionTypes.store;
  payload: NodeAction[];
}

type UIAction =
  Undo | Redo | Mult |
  Branch | Forward | Backward | Store;
export default UIAction;
