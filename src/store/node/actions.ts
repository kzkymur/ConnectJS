import Action, { ActionTypes } from './actionTypes';
import { BaseType, ConnectionType, DataType } from './types';

export const addAction = (base: BaseType): Action => ({
  type: ActionTypes.add,
  payload: { base: base, },
});
export const deleteAction = (baseId: number): Action => ({
  type: ActionTypes.delete,
  payload: { id: baseId, },
});

export const updateAction = (base: BaseType): Action => ({
  type: ActionTypes.update,
  payload: { base: base, },
});
export const updateNameAction = (id: number, name: string): Action => ({
  type: ActionTypes.updateName,
  payload: { id, name, },
});
export const updateSizeAction = (id: number, width: string, height: string, top: string, left: string): Action => ({
  type: ActionTypes.updateSize,
  payload: { id, width, height, top, left },
});
export const updatePosAction = (id: number, top: string, left: string): Action => ({
  type: ActionTypes.updatePos,
  payload: { id, top, left, },
});
export const addSocketAction = (baseId: number, isInput: boolean, type: DataType): Action => ({
  type: ActionTypes.addSocket,
  payload: { baseId, isInput, type },
});
export const deleteSocketAction = (baseId: number, isInput: boolean, id: number): Action => ({
  type: ActionTypes.deleteSocket,
  payload: { baseId, isInput, id },
});
export const undoAction = (): Action => ({ type: ActionTypes.undo, });
export const redoAction = (): Action => ({ type: ActionTypes.redo, });

export const addConnectionAction = (param: ConnectionType): Action => ({
  type: ActionTypes.addConnection, 
  payload: param,
});
export const updateConnectionAction = (param: ConnectionType): Action => ({ 
  type: ActionTypes.updateConnection, 
  payload: param,
});
export const deleteConnectionAction = (id: number): Action => ({
  type: ActionTypes.deleteConnection,
  payload: { id, },
});
