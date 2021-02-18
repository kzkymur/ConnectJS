import { GUIAction } from './actionTypes';

interface Partition {
  prev?: Element;
  next?: Element;
}
interface Element {
  action: GUIAction;
  prev: Partition;
  next: Partition;
}

export const OperationTypes = {
  branch: 'BRANCH',
  forward: 'FORWARD',
  backward: 'BACKWARD',
} as const;
export type OperationType = 
  typeof OperationTypes.branch | 
  typeof OperationTypes.forward | 
  typeof OperationTypes.backward;

type OperatingMethod = (action: GUIAction) => void;
type OperateType = (action: GUIAction, operationType: OperationType) => ReverseActionBranch;
export default class ReverseActionBranch {
  current: Partition = {};
  constructor (p?: Partition) { if (p !== undefined) { this.current = p; } };
  operate: OperateType = (action, operationType) => {
    switch (operationType) {
      case OperationTypes.branch: {
        this.branch(action);
        break;
      }
      case OperationTypes.backward: {
        this.backward(action);
        break;
      }
      case OperationTypes.forward: {
        this.forward(action);
        break;
      }
    }
    this.log();
    return this;
  }

  private branch: OperatingMethod = (action) => {
    const newElm: Element = {
      action: action,
      prev: this.current,
      next: {},
    };
    this.current.next = newElm; // ここで別のプロパティに登録できたらブランチに！
    const newPartition: Partition = {
      prev: newElm,
    };
    newElm.next = newPartition;
    this.current = newPartition;
  }
  private backward: OperatingMethod = (action) => {
    if (this.current.prev !== undefined) {
      this.current.prev.action = action;
      this.current = this.current.prev.prev;
    }
  }
  private forward: OperatingMethod = (action) => {
    if (this.current.next !== undefined) {
      this.current.next.action = action;
      this.current = this.current.next.next;
    }
  }
  private log = () => {
    let current = this.current;
    let log = '';
    while (current.next !== undefined) current = current.next.next;
    while (current.prev !== undefined) {
      if (current === this.current) {
        log += 'current\n';
      }
      log += `${current.prev.action.type}\n`;
      current = current.prev.prev;
    }
    if (current === this.current) {
      log += 'current\n';
    }
    console.log(log);
  }
}
