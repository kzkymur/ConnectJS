import { GUIAction } from './actionTypes';

interface Partition {
  prev?: Element;
  next?: Element;
  right?: Partition;
  left?: Partition;
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

export type ActionHistory = (GUIAction | ActionHistory)[];

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
  showBranch: () => ActionHistory = () => { 
    let current = this.current;
    while (current.prev !== undefined) current = current.prev.prev;
    // return this.search(current);
    return [];
  };
  checkout: (stepToRight: number) => void = (step) => {
    let increment: (i:number) => number;
    let swichBranch: () => void;
    if (step > 0) {
      increment = i => i-1;
      swichBranch = () => {
        if (this.current.right !== undefined) {
          const tmp = this.current.next;
          this.current.next = this.current.right.next;
          this.current.right.next = tmp;
        }
      }
    } else {
      increment = i => i+1;
      swichBranch = () => {
        if (this.current.left !== undefined) {
          const tmp = this.current.next;
          this.current.next = this.current.left.next;
          this.current.left.next = tmp;
        }
      }
    }
    let i = step;
    while (i !== 0) {
      i = increment(i);
      swichBranch();
    }
  }

  private branch: OperatingMethod = (action) => {
    const newElm: Element = {
      action: action,
      prev: this.current,
      next: {},
    }; 
    if (this.current.next !== undefined) {
      let current = this.current;
      while (current.right !== undefined) current = current.right;
      if (this.current.prev !== undefined) {
        this.current.prev.next = {
          prev: this.current.prev,
          left: current,
        };
        current.right = this.current.prev.next;
        this.current = this.current.prev.next;
      }
    }
    this.current.next = newElm;
    const newPartition: Partition = { prev: newElm, };
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
  // private search: (p: Partition) => ActionHistory = (p) => {
  //   let actionHistory: ActionHistory = [];
  //   while (p.next !== undefined) {
  //     let branches: ActionHistory[] = [];
  //     let current = p;
  //     while (current.left !== undefined) {
  //       branches.push(this.search(current.left));
  //       current = current.left;
  //     }
  //     current = p;
  //     while (current.right !== undefined) {
  //       branches.push(this.search(current.right));
  //       current = current.right;
  //     }
  //     if (branches.length !== 0) actionHistory.push(...branches);
  //   }
  //   return actionHistory;
  // }
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
