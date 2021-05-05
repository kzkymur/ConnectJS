import NodeAction from '@/store/node/actionTypes';
import { addAction as orgAddActioin, deleteAction as orgDeleteAction, updatePosAction, updateSizeAction, deleteConnectionAction, multAction } from '@/store/node/actions';
import { NodeMode } from '@/store/node/types';
import { initBaseWidth, initBaseHeight } from '@/config';

type AddAction = (mode: NodeMode) => NodeAction;
export const addAction: AddAction = (mode) => orgAddActioin({
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

type DeleteAction = (id: number, cIds: number[]) => NodeAction;
export const deleteAction: DeleteAction = (id, cIds) => multAction([
  orgDeleteAction(id),
  ...cIds.map(cId=>deleteConnectionAction(cId))
]);

type UpdatePosSizeAction = (id: number, top: string, left: string, width: string, height: string) => NodeAction;
export const updatePosSizeAction: UpdatePosSizeAction = (id, top, left, width, height) => multAction([
  updatePosAction(id, top, left),
  updateSizeAction(id, width, height),
]);
