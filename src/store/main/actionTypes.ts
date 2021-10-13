import { Action } from 'redux';
import { DataType } from './node';
import { ConnectionType, } from './types';
import Vector from '@/utils/vector';
import { EngineType } from './engine';
import ContentType from '@/content/types';

export const ActionTypes = {
  add: "ADD",
  delete: "DELETE",
  update: "UPDATE",
  updateName: "UPDATENAME",
  updateSize: "UPDATESIZE",
  updatePos: "UPDATEPOS",
  rerender: "RERENDER",
  addSocket: "ADDSOCKET",
  deleteSocket: "DELETESOCKET",

  undo: "UNDO",
  redo: "REDO",
  mult: "MULT",

  branch: "BRANCH",
  forward: "FORWARD",
  backward: "BACKWARD",
  store: "STORE",

  addConnection: "ADDCONNECTION",
  deleteConnection: "DELETECONNECTION",
  updateConnection: "UPDATECONNECTION",
  updateConnectionPos: "UPDATECONNECTIONPOS",
  updateConnectionType: "UPDATECONNECTIONTYPE",

  addEngine: "ADDENGINE",
  deleteEngine: "DELETEENGINE",
} as const;

// Actionの型定義
interface Add extends Action {
  type: typeof ActionTypes.add;
  payload: { node: ContentType; };
}
interface Delete extends Action {
  type: typeof ActionTypes.delete;
  payload: { id: number; };
}
interface Update extends Action {
  type: typeof ActionTypes.update;
  payload: { node: ContentType; };
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
interface Rerender extends Action {
  type: typeof ActionTypes.rerender;
  payload: { id: number; };
}
interface AddSocket extends Action {
  type: typeof ActionTypes.addSocket;
  payload: {
    nodeId: number;
    isInput: boolean;
    type: DataType;
  };
}
interface DeleteSocket extends Action {
  type: typeof ActionTypes.deleteSocket;
  payload: {
    nodeId: number;
    isInput: boolean;
    id: number;
  };
}

interface Undo extends Action { type: typeof ActionTypes.undo; }
interface Redo extends Action { type: typeof ActionTypes.redo; }
interface Mult extends Action {
  type: typeof ActionTypes.mult;
  payload: Action[];
}

interface Branch extends Action { type: typeof ActionTypes.branch; }
interface Forward extends Action { type: typeof ActionTypes.forward; }
interface Backward extends Action { type: typeof ActionTypes.backward; }
interface Store extends Action {
  type: typeof ActionTypes.store;
  payload: Action[];
}

interface AddConnection extends Action { 
  type: typeof ActionTypes.addConnection; 
  payload: {
    connection: ConnectionType;
  };
}
interface DeleteConnection extends Action { 
  type: typeof ActionTypes.deleteConnection; 
  payload: { id: number; };
}
interface UpdateConnection extends Action { 
  type: typeof ActionTypes.updateConnection; 
  payload: {
    connection: ConnectionType;
  };
}
interface UpdateConnectionPos extends Action { 
  type: typeof ActionTypes.updateConnectionPos;
  payload: {
    id: number;
    s: Vector;
    e: Vector;
  };
}
interface UpdateConnectionType extends Action { 
  type: typeof ActionTypes.updateConnectionType;
  payload: {
    id: number;
    type: DataType;
  };
}
interface AddEngine extends Action { 
  type: typeof ActionTypes.addEngine; 
  payload: { engine: EngineType; };
}
interface DeleteEngine extends Action { 
  type: typeof ActionTypes.deleteEngine; 
  payload: { id: number; };
}

type NodeAction =
  Add | Delete |
  Update | UpdateName | UpdateSize | UpdatePos | Rerender |
  AddSocket | DeleteSocket |
  Undo | Redo | Mult |
  Branch | Forward | Backward | Store |
  AddConnection | DeleteConnection |
  UpdateConnection | UpdateConnectionPos | UpdateConnectionType |
  AddEngine | DeleteEngine;
export default NodeAction;
