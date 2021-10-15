import NodeAction from '@/store/main/actionTypes';
import UIAction, { Mult } from '@/store/ui/actionTypes';
import { ModeType, } from '@/content/types';
import { addAction as orgAddActioin, deleteAction as orgDeleteAction, updatePosAction, updateSizeAction, deleteConnectionAction } from '@/store/main/actions';
import { multAction } from '@/store/ui/actions';
import { Content } from '@/content/types';

type Action = NodeAction | UIAction;

type AddAction = (mode: ModeType) => Action;
export const addAction: AddAction = mode => {
  if (Content[mode] !== undefined) return orgAddActioin(Content[mode]());
  return multAction([]);
}

type DeleteAction = (id: number, cIds: number[]) => Mult;
export const deleteAction: DeleteAction = (id, cIds) => multAction([
  orgDeleteAction(id),
  ...cIds.map(cId=>deleteConnectionAction(cId))
]);

type UpdatePosSizeAction = (id: number, top: string, left: string, width: string, height: string) => Mult;
export const updatePosSizeAction: UpdatePosSizeAction = (id, top, left, width, height) => multAction([
  updatePosAction(id, top, left),
  updateSizeAction(id, width, height),
]);
