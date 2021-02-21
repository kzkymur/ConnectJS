import { Action } from 'redux';

export const ActionTypes = {
  openCP: "OPENCP",
  closeCP: "CLOSECP",
  closeAllCP: "CLOSEALLCP",
} as const;

interface OpenCP extends Action {
  type: typeof ActionTypes.openCP;
  payload: { id: number; }
}
interface CloseCP extends Action {
  type: typeof ActionTypes.closeCP;
  payload: { index: number; }
}
interface CloseAllCP extends Action { type: typeof ActionTypes.closeAllCP; }

type PanelAction = 
  OpenCP | CloseCP | CloseAllCP;
export default PanelAction;
