import NodeAction from '@/store/main/actionTypes';
import { ModeType, } from '@/content/types';
import { addAction as orgAddActioin, deleteAction as orgDeleteAction, updatePosAction, updateSizeAction, deleteConnectionAction, multAction } from '@/store/main/actions';
import { Content } from '@/content/types';

type AddAction = (mode: ModeType) => NodeAction;
export const addAction: AddAction = mode => {
  if (Content[mode] !== undefined) return orgAddActioin(Content[mode]());
  return multAction([]);
}

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
