import React, { MutableRefObject } from 'react';
import { Node, isResizable } from '@/store/main/node';
import { ConnectionType, } from '@/store/main/types';
import NodeAction from '@/store/main/actionTypes';
import { multAction, updatePosAction, updateConnectionPosAction } from '@/store/main/actions';
import { Handler as ConnectionHandler } from '@/component/Connection';
import { Handler as NodeHandler, Props as NodeProps } from '@/component/Node';
import { px } from '@/utils';
import Vector, { subtract, multiply, hadamard, signFilter } from '@/utils/vector';
import { deleteAction, updatePosSizeAction } from '@/utils/actions';
import { border, optBarHeight } from '@/config';

class Props {
  #node: Node & { ref: MutableRefObject<NodeHandler>; };
  #in: ConnectionInfo[]; 
  #out: ConnectionInfo[];
  #openCP: (id:number) => void;
  #ncr: MutableRefObject<ConnectionHandler>;
  #ncir: MutableRefObject<NewConnectionInfo>;
  #addConnection: (c: ConnectionType) => void;
  #dispatch: (action: NodeAction) => void;
  #isOnBorder: boolean = true;
  readonly property: Node;
  readonly resizable: boolean;

  constructor ( node: Node & { ref: MutableRefObject<NodeHandler>; },
    inputConnections: ConnectionInfo[],
    outputConnections: ConnectionInfo[],
    openCP: (id:number)=>void,
    newConnectionRef: MutableRefObject<ConnectionHandler>,
    newConnectionInfoRef: MutableRefObject<NewConnectionInfo>,
    addConnection: (c: ConnectionType) => void,
    dispatch: (action: NodeAction) => void,
  ) {
    this.#node = node;
    this.property = node;
    this.resizable = isResizable(this.#node);
    this.#in = inputConnections;
    this.#out = outputConnections;
    this.#openCP = openCP;
    this.#ncr = newConnectionRef;
    this.#ncir = newConnectionInfoRef;
    this.#addConnection = addConnection;
    this.#dispatch = dispatch;
  }

  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const m = {x: e.clientX, y: e.clientY };
    const left = bcr.x, right = bcr.x + bcr.width, top = bcr.y, bottom = bcr.y + bcr.height;
    const isLeftSide = left - border < m.x && m.x < left + border, isRightSide = right - border < m.x && m.x < right + border;
    const isUpperSide = top - border < m.y && m.y < top + border, isLowerSide = bottom - border < m.y && m.y < bottom + border;
    let cursor;
    if (this.resizable && (isLeftSide || isRightSide || isUpperSide || isLowerSide)) {
      cursor = (isLeftSide && isUpperSide) || (isRightSide && isLowerSide) ? 'nwse' :
        (isLeftSide && isLowerSide) || (isRightSide && isUpperSide) ? 'nesw' :
        isLeftSide || isRightSide ? 'ew' : 'ns';
      cursor = `${cursor}-resize`;
      this.#isOnBorder = true;
    } else {
      cursor = 'default';
      this.#isOnBorder = false;
    }
    e.currentTarget.style.cursor = cursor;
  }

  private posChange: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    let s = { x: e.clientX, y: e.clientY };
    const mousemove = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY, };
      const sm = subtract(m, s); s = m;
      this.#node.ref.current.updatePosStyle(sm);
      this.#in.forEach(ic=>{ ic.ref.current.changeViewWithDiff(false, sm); });
      this.#out.forEach(oc=>{ oc.ref.current.changeViewWithDiff(true, sm); });
    }
    const isPosUpdate = () => {
      const { x, y } = this.#node.ref.current.getPos();
      const top = px(y), left = px(x);
      if (left !== this.#node.left || top !== this.#node.top) {
        this.updatePos(top, left);
        return true;
      }
      return false;
    }
    const mouseup = () => {
      if (!isPosUpdate()) this.#openCP(this.#node.id);
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }
  private sizeChange: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const c = { x: bcr.x + bcr.width / 2, y: bcr.y + bcr.height / 2 };
    let s = { x: e.clientX, y: e.clientY };
    const cs = subtract(s, c), signs = signFilter(cs), revX = { x: -1, y: 1 };
    const mousemove = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY };
      const sm = subtract(m, s), d = hadamard(sm, signs); s = m;
      const f = this.#node.ref.current.updateSizeStyle(multiply(d, 2));
      this.#node.ref.current.updatePosStyle(multiply(hadamard(d, f),-1));
      this.#in.forEach(ic=>{ ic.ref.current.changeViewWithDiff(false, hadamard(hadamard(revX, d), f)); });
      this.#out.forEach(oc=>{ oc.ref.current.changeViewWithDiff(true, hadamard(d, f)); });
    }
    const updateSizeState = () => {
      const v = this.#node.ref.current.getSize();
      const width = px(v.x), height = px(calcMainHeight(v.y, this.#node.inputs.length, this.#node.outputs.length));
      const pos = this.#node.ref.current.getPos();
      if (isResizable(this.#node)) {
        if (this.#node.width !== width || this.#node.height !== height) this.updateSize(px(pos.y), px(pos.x), width, height);
      }
    }
    const mouseup = () => {
      updateSizeState();
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    if (this.#isOnBorder) this.sizeChange(e);
    else this.posChange(e);
  }

  operateNewConnection: (isInput: boolean, id: number) => () => void = (isInput, id) => () => {
    const s = this.#node.ref.current.getJointPos(isInput, id);
    this.#ncir.current.isInput = isInput;
    this.#ncir.current.nodeId = this.#node.id;
    this.#ncir.current.id = id;
    this.#ncir.current.s = s;
    const mousemove = (e: MouseEvent) => {
      const eClient = { x: e.clientX, y: e.clientY, };
      if (isInput) this.#ncr.current.changeView(eClient, s);
      else this.#ncr.current.changeView(s, eClient);
    }
    const mouseup = () => {
      const zeroV = { x: 0, y:0 };
      this.#ncr.current.changeView(zeroV, zeroV);
      window.removeEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }
  registerNewConnection: (isInput: boolean, id: number) => () => void = (isInput, id) => () => {
    const ncir = this.#ncir.current;
    if (isInput === ncir.isInput) return;
    if (this.#node.id === ncir.nodeId) return;
    if (ncir.nodeId === undefined || ncir.isInput === undefined || ncir.id === undefined || ncir.s === undefined) return;
    const e = this.#node.ref.current.getJointPos(isInput, id);
    this.#addConnection({
      type: 1,
      id: -1,
      iNodeId: isInput ? this.#node.id : ncir.nodeId,
      iId: isInput ? id : ncir.id,
      oNodeId: !isInput ? this.#node.id : ncir.nodeId,
      oId: !isInput ? id : ncir.id,
      s: !isInput ?  e : ncir.s,
      e: isInput ?  e : ncir.s,
    })
  }

  deleteFunc = () => { this.#dispatch(deleteAction(this.#node.id, [ ...this.#in.map(c=>c.id), ...this.#out.map(c=>c.id), ])); }

  private updateSize = (top: string, left: string, width: string, height: string) => {
    const actions = [ updatePosSizeAction(this.#node.id, top, left, width, height), ];
    this.#in.forEach(c=>actions.push(updateConnectionPosAction(c.id, c.s, this.#node.ref.current.getJointPos(true, c.iId))));
    this.#out.forEach(c=>actions.push(updateConnectionPosAction(c.id, this.#node.ref.current.getJointPos(false, c.oId), c.e)));
    this.#dispatch(multAction(actions));
  }
  private updatePos = (top: string, left: string) => {
    const actions = [ updatePosAction(this.#node.id, top, left), ];
    this.#in.forEach(c=>actions.push(updateConnectionPosAction(c.id, c.s, this.#node.ref.current.getJointPos(true, c.iId))));
    this.#out.forEach(c=>actions.push(updateConnectionPosAction(c.id, this.#node.ref.current.getJointPos(false, c.oId), c.e)));
    this.#dispatch(multAction(actions));
  }
}

export default function nodeProps (
  node: Node & { ref: MutableRefObject<NodeHandler>; },
  inputConnections: ConnectionInfo[],
  outputConnections: ConnectionInfo[],
  openCP: (id:number)=>void,
  newConnectionRef: MutableRefObject<ConnectionHandler>,
  newConnectionInfoRef: MutableRefObject<NewConnectionInfo>,
  addConnection: (c: ConnectionType) => void,
  dispatch: (action: NodeAction) => void,
): NodeProps {
  const obj = new Props(node, inputConnections, outputConnections, openCP, newConnectionRef, newConnectionInfoRef, addConnection, dispatch);
  return { ...obj };
}

type ConnectionInfo = ConnectionType & { ref: MutableRefObject<ConnectionHandler>; };
export type NewConnectionInfo = {
  isInput?: boolean;
  nodeId?: number;
  id?: number;
  s?: Vector;
};

const calcMainHeight = (height: number, nInputs: number, nOutputs: number): number => (height - optBarHeight * (Math.max(nInputs, nOutputs)+1));
