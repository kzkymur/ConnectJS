import NodeAction from '@/store/node/actionTypes';
import { addAction as originalAddAction } from '@/store/node/actions';
import { NodeMode } from '@/store/node/types';
import { initBaseWidth, initBaseHeight } from '@/config';

type AddAction = (mode: NodeMode) => NodeAction;
export const addAction: AddAction = (mode) => originalAddAction({
  id: -1,
  mode: mode,
  name: '',
  width: `${initBaseWidth}px`,
  height: `${initBaseHeight}px`,
  top: `${String(40 + 20 * Math.random())}%`,
  left: `${String(40 + 20 * Math.random())}%`,
  outputs: [],
  inputs: [],
  outputsLatestId: 0,
  inputsLatestId: 0,
});
