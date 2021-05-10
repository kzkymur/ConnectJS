import { DataType, NodeFunc } from './types';

interface BackNodeInfo {
  current: BackNode;
  index: number;
}
class BackNode {
  #nodeFunc: NodeFunc;
  #inputValues: DataType[];
  #inputFlags: boolean[];
  #outBackNodes: BackNodeInfo[];
  constructor (nodeFunc: NodeFunc, inputValues: DataType[], outBackNodes: BackNodeInfo[] = []) {
    this.#nodeFunc = nodeFunc;
    this.#inputValues = inputValues;
    this.#outBackNodes = outBackNodes;
    this.#inputFlags = Array(this.#inputValues.length).fill(false); // lint error対策
  }

  private initInputFlags = () => this.#inputFlags = Array(this.#inputValues.length).fill(false);
  private isInputsOk = () => { for (const f of this.#inputFlags) if (!f) return false; return true; }

  setInput = (index: number, value: DataType) => {
    this.#inputValues[index] = value;
    this.#inputFlags[index] = true;
    if (this.isInputsOk()) {
      const out = this.#nodeFunc(...this.#inputValues);
      this.#outBackNodes.forEach((obn, i) => obn.current.setInput(obn.index, out[i]));
      this.initInputFlags();
    }
  }

  setOutBackNode = (index: number, backNode: BackNodeInfo) => {
    for (let i=this.#outBackNodes.length; i < index+1; i++) this.#outBackNodes.push();
    this.#outBackNodes[index] = backNode;
  }
}

class Engine {

}
