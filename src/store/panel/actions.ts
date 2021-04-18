import Action, { ActionTypes } from './actionTypes';

export const openCPAction = (baseId: number): Action => ({
  type: ActionTypes.openCP,
  payload: { id: baseId, }
});
export const closeCPAction = (index: number): Action => ({
  type: ActionTypes.closeCP,
  payload: { index: index, }
});
export const closeCPByIdAction = (id: number): Action => ({
  type: ActionTypes.closeCPById,
  payload: { id, }
});
export const closeAllCPAction = (): Action => ({ type: ActionTypes.closeAllCP, });
