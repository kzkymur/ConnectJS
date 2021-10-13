import Action, { ActionTypes } from './actionTypes';
import { DataType } from './node';
import { ConnectionType, } from './types';
import Vector from '@/utils/vector';
import { EngineType } from './engine'
import ContentType from '@/content/types';

export const addAction = (node: ContentType): Action => ({
  type: ActionTypes.add,
  payload: { node, },
});
export const deleteAction = (nodeId: number): Action => ({
  type: ActionTypes.delete,
  payload: { id: nodeId, },
});

export const updateAction = (node: ContentType): Action => ({
  type: ActionTypes.update,
  payload: { node, },
});
export const updateNameAction = (id: number, name: string): Action => ({
  type: ActionTypes.updateName,
  payload: { id, name, },
});
export const updateSizeAction = (id: number, width: string, height: string): Action => ({
  type: ActionTypes.updateSize,
  payload: { id, width, height, },
});
export const updatePosAction = (id: number, top: string, left: string): Action => ({
  type: ActionTypes.updatePos,
  payload: { id, top, left, },
});
export const rerenderAction = (id: number): Action => ({
  type: ActionTypes.rerender,
  payload: { id, },
});
export const addSocketAction = (nodeId: number, isInput: boolean, type: DataType): Action => ({
  type: ActionTypes.addSocket,
  payload: { nodeId, isInput, type },
});
export const deleteSocketAction = (nodeId: number, isInput: boolean, id: number): Action => ({
  type: ActionTypes.deleteSocket,
  payload: { nodeId, isInput, id },
});
export const undoAction = (): Action => ({ type: ActionTypes.undo, });
export const redoAction = (): Action => ({ type: ActionTypes.redo, });
export const multAction = (actions: Action[]): Action => ({
  type: ActionTypes.mult,
  payload: actions,
});

export const branchAction = (): Action => ({ type: ActionTypes.branch, });
export const forwardAction = (): Action => ({ type: ActionTypes.forward, });
export const backwardAction = (): Action => ({ type: ActionTypes.backward, });
export const storeAction = (actions: Action[]): Action => ({
  type: ActionTypes.store,
  payload: actions,
});

export const addConnectionAction = (connection: ConnectionType): Action => ({
  type: ActionTypes.addConnection,
  payload: { connection, },
});
export const updateConnectionAction = (connection: ConnectionType): Action => ({ 
  type: ActionTypes.updateConnection, 
  payload: { connection, },
});
export const updateConnectionTypeAction = (id: number, type: DataType): Action => ({ 
  type: ActionTypes.updateConnectionType,
  payload: { id, type },
});
export const updateConnectionPosAction = (id: number, s: Vector, e: Vector): Action => ({ 
  type: ActionTypes.updateConnectionPos,
  payload: { id, s, e },
});
export const deleteConnectionAction = (id: number): Action => ({
  type: ActionTypes.deleteConnection,
  payload: { id, },
});

export const addEngine = (engine: EngineType): Action => ({
  type: ActionTypes.addEngine,
  payload: { engine, },
});
export const deleteEngine = (id: number): Action => ({
  type: ActionTypes.deleteEngine,
  payload: { id, },
});
