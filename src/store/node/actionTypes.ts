import { Action } from 'redux';
import { BaseType, ConnectionType } from './types';

export const ActionTypes = {
  add: "ADD",
  delete: "DELETE",
  update: "UPDATE",
  updateName: "UPDATENAME",
  updateSize: "UPDATESIZE",
  updatePos: "UPDATEPOS",

  undo: "UNDO",
  redo: "REDO",

  addConnection: "ADDCONNECTION",
  updateConnection: "UPDATECONNECTION",
  deleteConnection: "DELETECONNECTION",
} as const;

// Actionの型定義
interface Add extends Action {
  type: typeof ActionTypes.add;
  payload: { base: BaseType; };
}
interface Delete extends Action {
  type: typeof ActionTypes.delete;
  payload: { id: number; };
}
interface Update extends Action {
  type: typeof ActionTypes.update;
  payload: { base: BaseType; };
}
interface UpdateName extends Action {
  type: typeof ActionTypes.updateName;
  payload: {
    id: number;
    name: string;
  };
}
interface UpdateSize extends Action {
  type: typeof ActionTypes.updateSize;
  payload: { 
    id: number;
    width: string;
    height: string;
  };
}
interface UpdatePos extends Action {
  type: typeof ActionTypes.updatePos;
  payload: { 
    id: number;
    top: string;
    left: string;
  };
}

interface Undo extends Action { type: typeof ActionTypes.undo; }
interface Redo extends Action { type: typeof ActionTypes.redo; }

interface AddConnection extends Action { 
  type: typeof ActionTypes.addConnection; 
  payload: ConnectionType;
}
interface UpdateConnection extends Action { 
  type: typeof ActionTypes.updateConnection; 
  payload: ConnectionType;
}
interface DeleteConnection extends Action { 
  type: typeof ActionTypes.deleteConnection; 
  payload: { index: number; };
}
type NodeAction = 
  Add | Delete | 
  Update | UpdateName | UpdateSize | UpdatePos |
  Undo | Redo | 
  AddConnection | UpdateConnection | DeleteConnection; 
export default NodeAction;
