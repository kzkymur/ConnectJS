import { ActionTypes, GUIAction } from './actionTypes';
import { Content, Connection } from './types';

export const addAction = (content: Content): GUIAction => ({
  type: ActionTypes.add,
  payload: { content: content, },
});
export const deleteAction = (baseId: number): GUIAction => ({
  type: ActionTypes.delete,
  payload: { id: baseId, },
});

export const updateAction = (content: Content): GUIAction => ({
  type: ActionTypes.update,
  payload: { content: content, },
});
export const undoAction = (): GUIAction => ({ type: ActionTypes.undo, });
export const redoAction = (): GUIAction => ({ type: ActionTypes.redo, });

export const openCPAction = (baseId: number): GUIAction => ({
  type: ActionTypes.openCP,
  payload: { id: baseId, }
});
export const closeCPAction = (index: number): GUIAction => ({
  type: ActionTypes.closeCP,
  payload: { index: index, }
});
export const closeAllCPAction = (): GUIAction => ({ type: ActionTypes.closeAllCP, });

export const addConnectionAction = (param: Connection): GUIAction => ({
  type: ActionTypes.addConnection, 
  payload: param	
});
export const updateConnectionAction = (param: Connection): GUIAction => ({ 
  type: ActionTypes.updateConnection, 
  payload: param	
});
export const deleteConnectionAction = (index: number): GUIAction => ({
  type: ActionTypes.deleteConnection,
  payload: { index: index, }
});
