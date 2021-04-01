import Action, { ActionTypes } from './actionTypes';
import { Content, ConnectionType } from './types';

export const addAction = (content: Content): Action => ({
  type: ActionTypes.add,
  payload: { content: content, },
});
export const deleteAction = (baseId: number): Action => ({
  type: ActionTypes.delete,
  payload: { id: baseId, },
});

export const updateAction = (content: Content): Action => ({
  type: ActionTypes.update,
  payload: { content: content, },
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
export const deleteConnectionAction = (index: number): Action => ({
  type: ActionTypes.deleteConnection,
  payload: { index: index, },
});
