import NodeAction from '@/store/node/actionTypes';
import { addAction as originalAddAction } from '@/store/node/actions';
import { NodeMode } from '@/store/node/types';

type AddAction = (mode: NodeMode) => NodeAction;
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
