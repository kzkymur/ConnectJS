import React, { MutableRefObject } from 'react';
import { BaseType, ConnectionType, DataTypes } from '@/store/node/types';
import { Handler as ConnectionHandler } from '@/component/Connection';
import { Handler as BaseHandler, Props as BaseProps } from '@/component/Base';
import Vector, { add, subtract, multiply, hadamard, signFilter } from '@/utils/vector';
import { border } from '@/config';

class Props {
  #base: BaseType & { ref: MutableRefObject<BaseHandler>; };
  #in: ConnectionInfo[]; 
  #out: ConnectionInfo[];
  #openCP: (id:number) => void;
  #ncr: MutableRefObject<ConnectionHandler>;
  #ncir: MutableRefObject<NewConnectionInfo>;
  #addConnection: (c: ConnectionType) => void;
  #isOnBorder: boolean = true;
  readonly property: BaseType;

  constructor ( base: BaseType & { ref: MutableRefObject<BaseHandler>; },
    inputConnections: ConnectionInfo[],
    outputConnections: ConnectionInfo[],
    openCP: (id:number)=>void,
    newConnectionRef: MutableRefObject<ConnectionHandler>,
    newConnectionInfoRef: MutableRefObject<NewConnectionInfo>,
    addConnection: (c: ConnectionType) => void,
  ) {
    this.#base = base;
    this.property = base;
    this.#in = inputConnections;
    this.#out = outputConnections;
    this.#openCP = openCP;
    this.#ncr = newConnectionRef;
    this.#ncir = newConnectionInfoRef;
    this.#addConnection = addConnection;
  }

  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const m = {x: e.clientX, y: e.clientY };
    const left = bcr.x, right = bcr.x + bcr.width, top = bcr.y, bottom = bcr.y + bcr.height;
    const isLeftSide = left - border < m.x && m.x < left + border, isRightSide = right - border < m.x && m.x < right + border;
    const isUpperSide = top - border < m.y && m.y < top + border, isLowerSide = bottom - border < m.y && m.y < bottom + border;
    let cursor;
    if (isLeftSide || isRightSide || isUpperSide || isLowerSide) {
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
    const pos = this.#base.ref.current.getPos();
    const s = {x: e.clientX, y: e.clientY };
    const mousemove = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY, };
      const sm = subtract(m, s);
      this.#base.ref.current.updatePosStyle(add(sm, pos));
      this.#in.forEach(ic=>{ ic.ref.current.changeViewWithDiff(false, sm); });
      this.#out.forEach(oc=>{ oc.ref.current.changeViewWithDiff(true, sm); });
    }
    const mouseup = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY, };
      const sm = subtract(m, s);
      if (this.#base.ref.current.updatePosState(add(sm, pos))) {
        this.#in.forEach(ic=>{ ic.ref.current.setPosWithDiff(false, sm)});
        this.#out.forEach(oc=>{ oc.ref.current.setPosWithDiff(true, sm)});
      } else {
        this.#openCP(this.#base.id);
      }
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }
  private sizeChange: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const c = { x: bcr.x + bcr.width / 2, y: bcr.y + bcr.height / 2 };
    const s = { x: e.clientX, y: e.clientY };
    const cs = subtract(s, c), signs = signFilter(cs), revX = { x: -1, y: 1 };
    const p = this.#base.ref.current.getPos(), a = this.#base.ref.current.getSize();
    const mousemove = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY };
      const sm = subtract(m, s), d = hadamard(sm, signs);
      this.#base.ref.current.updatePosStyle(add(p, multiply(d, -1)));
      this.#base.ref.current.updateSizeStyle(add(a, multiply(d, 2)));
      this.#in.forEach(ic=>{ ic.ref.current.changeViewWithDiff(false, hadamard(revX, d)); });
      this.#out.forEach(oc=>{ oc.ref.current.changeViewWithDiff(true, d); });
    }
    const mouseup = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY };
      const sm = subtract(m, s), d = hadamard(sm, signs);
      this.#base.ref.current.updatePosState(add(p, multiply(d, -1)));
      this.#base.ref.current.updateSizeState(add(a, multiply(d, 2)))
      this.#in.forEach(ic=>{ ic.ref.current.setPosWithDiff(false, hadamard(revX, d))});
      this.#out.forEach(oc=>{ oc.ref.current.setPosWithDiff(true, d)});
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
    const s = this.#base.ref.current.getJointPos(isInput, id);
    this.#ncir.current.isInput = isInput;
    this.#ncir.current.baseId = this.#base.id;
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
    if (this.#base.id === ncir.baseId) return;
    if (ncir.baseId === undefined || ncir.isInput === undefined || ncir.id === undefined || ncir.s === undefined) return;
    const e = this.#base.ref.current.getJointPos(isInput, id);
    this.#addConnection({
      type: DataTypes.Number,
      id: -1,
      iBaseId: isInput ? this.#base.id : ncir.baseId,
      iId: isInput ? id : ncir.id,
      oBaseId: !isInput ? this.#base.id : ncir.baseId,
      oId: !isInput ? id : ncir.id,
      s: !isInput ?  e : ncir.s,
      e: isInput ?  e : ncir.s,
    })
  }
}

export default function baseProps (
  base: BaseType & { ref: MutableRefObject<BaseHandler>; },
  inputConnections: ConnectionInfo[],
  outputConnections: ConnectionInfo[],
  openCP: (id:number)=>void,
  newConnectionRef: MutableRefObject<ConnectionHandler>,
  newConnectionInfoRef: MutableRefObject<NewConnectionInfo>,
  addConnection: (c: ConnectionType) => void,
): BaseProps {
  const obj = new Props(base, inputConnections, outputConnections, openCP, newConnectionRef, newConnectionInfoRef, addConnection);
  return { ...obj };
}

type ConnectionInfo = ConnectionType & { ref: MutableRefObject<ConnectionHandler>; };
export type NewConnectionInfo = {
  isInput?: boolean;
  baseId?: number;
  id?: number;
  s?: Vector;
};
