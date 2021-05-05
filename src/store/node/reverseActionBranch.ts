import Action from './actionTypes';

interface Partition {
  prev?: Element;
  next?: Element;
  right?: Partition;
  left?: Partition;
}
interface Element {
  actions: Action[];
  prev: Partition;
  next: Partition;
}

export const OperationTypes = {
  branch: 'BRANCH',
  forward: 'FORWARD',
  backward: 'BACKWARD',
  store: 'STORE',
} as const;
export type OperationType =
  typeof OperationTypes.branch |
  typeof OperationTypes.forward |
  typeof OperationTypes.backward |
  typeof OperationTypes.store;

export type ActionHistory = (Action | ActionHistory)[];

type OperatingMethod = (actions?: Action[]) => void;
type OperateType = (operationType: OperationType, actions?: Action[]) => ReverseActionBranch;
export default class ReverseActionBranch {
  current: Partition = {};
  private actionQue: Action[] = [];
  constructor (p?: Partition) { if (p !== undefined) { this.current = p; } };
  operate: OperateType = (operationType, actions = []) => {
    switch (operationType) {
      case OperationTypes.branch: {
        this.branch();
        break;
      }
      case OperationTypes.forward: {
        this.forward();
        break;
      }
      case OperationTypes.backward: {
        this.backward();
        break;
      }
      case OperationTypes.store: {
        this.store(actions);
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

  private branch: OperatingMethod = () => {
    if (this.actionQue.length===0) return;
    const newElm: Element = {
      actions: this.actionQue,
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
    this.actionQue = [];
    this.current = newPartition;
  }
  private forward: OperatingMethod = () => {
    if (this.actionQue.length===0) return;
    if (this.current.next !== undefined) {
      this.current.next.actions = this.actionQue;
      this.actionQue = [];
      this.current = this.current.next.next;
    }
  }
  private backward: OperatingMethod = () => {
    if (this.actionQue.length===0) return;
    if (this.current.prev !== undefined) {
      this.current.prev.actions = this.actionQue;
      this.actionQue = [];
      this.current = this.current.prev.prev;
    }
  }
  private store: OperatingMethod = (actions = []) => { this.actionQue = [...actions, ...this.actionQue]; }
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
      log += '[\n';
      current.prev.actions.forEach(a=>{log += ` ${a.type}\n`});
      log += ']\n';
      current = current.prev.prev;
    }
    if (current === this.current) {
      log += 'current\n';
    }
    console.log(log);
  }
}
