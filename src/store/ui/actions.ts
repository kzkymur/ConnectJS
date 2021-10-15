import Action, { ActionTypes, Mult } from './actionTypes';
import NodeAction from '../main/actionTypes';

export const undoAction = (): Action => ({ type: ActionTypes.undo, });
export const redoAction = (): Action => ({ type: ActionTypes.redo, });
export const multAction = (actions: (NodeAction | Mult)[]): Mult => ({
  type: ActionTypes.mult,
  payload: actions,
});

export const branchAction = (): Action => ({ type: ActionTypes.branch, });
export const forwardAction = (): Action => ({ type: ActionTypes.forward, });
export const backwardAction = (): Action => ({ type: ActionTypes.backward, });
export const storeAction = (actions: NodeAction[]): Action => ({
  type: ActionTypes.store,
  payload: actions,
});
