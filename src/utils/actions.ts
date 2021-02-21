import { GUIAction } from '@/store/actionTypes';
import { addAction as originalAddAction } from '@/store/actions';
import { NodeMode } from '@/store/types';

type AddAction = (mode: NodeMode) => GUIAction;
export const addAction: AddAction = (mode) => originalAddAction({
  id: -1,
  mode: mode,
  name: '',
  width: '160px',
  height: '120px',
  top: String(40 + 20 * Math.random()) + '%',
  left: String(40 + 20 * Math.random()) + '%',
  outputs: [],
  inputs: [],
});
