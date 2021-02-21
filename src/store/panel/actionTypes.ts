import { Action } from 'redux';

export const ActionTypes = {
  openCP: "OPENCP",
  closeCP: "CLOSECP",
  closeCPById: "CLOSECPById",
  closeAllCP: "CLOSEALLCP",
} as const;

interface OpenCP extends Action {
  type: typeof ActionTypes.openCP;
  payload: { id: number; }
}
interface CloseCPById extends Action {
  type: typeof ActionTypes.closeCPById;
  payload: { id: number; }
}
interface CloseCP extends Action {
  type: typeof ActionTypes.closeCP;
  payload: { index: number; }
}
interface CloseAllCP extends Action { type: typeof ActionTypes.closeAllCP; }

type PanelAction = 
  OpenCP | CloseCP | CloseCPById | CloseAllCP;
export default PanelAction;
