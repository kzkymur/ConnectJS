import { Action } from 'redux';
import { Content, Connection } from './types';

export const ActionTypes = {
  add: "ADD",
  delete: "DELETE",
  update: "UPDATE",
  updateName: "UPDATENAME",
  updateSize: "UPDATESIZE",
  updatePos: "UPDATEPOS",

  undo: "UNDO",
  redo: "REDO",

  openCP: "OPENCP",
  closeCP: "CLOSECP",
  closeAllCP: "CLOSEALLCP",

  addConnection: "ADDCONNECTION",
  updateConnection: "UPDATECONNECTION",
  deleteConnection: "DELETECONNECTION",
} as const;

// Actionの型定義
interface Add extends Action {
  type: typeof ActionTypes.add;
  payload: { content: Content; }
}
interface Delete extends Action {
  type: typeof ActionTypes.delete;
  payload: { id: number; }
}
interface Update extends Action {
  type: typeof ActionTypes.update;
  payload: { content: Content; }
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

interface OpenCP extends Action {
  type: typeof ActionTypes.openCP;
  payload: { id: number; }
}
interface CloseCP extends Action {
  type: typeof ActionTypes.closeCP;
  payload: { index: number; }
}
interface CloseAllCP extends Action { type: typeof ActionTypes.closeAllCP; }

interface AddConnection extends Action { 
  type: typeof ActionTypes.addConnection; 
  payload: Connection
}
interface UpdateConnection extends Action { 
  type: typeof ActionTypes.updateConnection; 
  payload: Connection
}
interface DeleteConnection extends Action { 
  type: typeof ActionTypes.deleteConnection; 
  payload: { index: number; }
}
type NodeAction = 
  Add | Delete | 
  Update | UpdateName | UpdateSize | UpdatePos |
  Undo | Redo | 
  OpenCP | CloseCP | CloseAllCP | 
  AddConnection | UpdateConnection | DeleteConnection; 
export default NodeAction;
