import { Action } from 'redux';
import { EditorModeType } from './types';
import { glEditor, Connection } from './types';

export const ActionTypes = {
  add: "ADD",
  delete: "DELETE",
  update: "UPDATE",

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
  payload: { mode: EditorModeType; }
}
interface Delete extends Action {
  type: typeof ActionTypes.delete;
  payload: { id: number; }
}
interface Update extends Action {
  type: typeof ActionTypes.update;
  payload: { glEditor: glEditor; }
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
export type GlEditorActionTypes = Add | Delete | Update | Undo | Redo | OpenCP | CloseCP | CloseAllCP | AddConnection | UpdateConnection | DeleteConnection; 
