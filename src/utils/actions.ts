import NodeAction from '@/store/main/actionTypes';
import { Node, } from '@/store/main/node';
import { Modes, ModeType, } from '@/content/types';
import { addAction as orgAddActioin, deleteAction as orgDeleteAction, updatePosAction, updateSizeAction, deleteConnectionAction, multAction } from '@/store/main/actions';
import { Canvas, Counter, } from '@/content/types';

type AddAction = (mode: ModeType) => NodeAction;
export const addAction: AddAction = mode => {
  let content: Node;
  switch (mode) {
    case Modes.canvas: {
      content = new Canvas();
      break;
    }
    case Modes.counter: {
      content = new Counter();
      break;
    }
    default: {
      content = new Node(mode);
    }
  }
  return orgAddActioin(content);
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
