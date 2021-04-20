import React, { MutableRefObject } from 'react';
import { BaseType, ConnectionType, DataTypes } from '@/store/node/types';
import { Handler as ConnectionHandler } from '@/component/Connection';
import { Handler as BaseHandler, Props as BaseProps } from '@/component/Base';
import Vector, { add, subtract } from '@/utils/vector';
import { border } from '@/config';

class Props {
  #base: BaseType & { ref: MutableRefObject<BaseHandler>; };
  #in: ConnectionInfo[]; 
  #out: ConnectionInfo[];
  #openCP: (id:number) => void;
  #isSizeChanging: boolean = true;
  #ncr: MutableRefObject<ConnectionHandler>;
  #ncir: MutableRefObject<NewConnectionInfo>;
  #addConnection: (c: ConnectionType) => void;
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

  posChange: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    this.#isSizeChanging = false;
    const pos = this.#base.ref.current.getPos();
    const s = {x: e.clientX, y: e.clientY };
    const mousemove = (e: MouseEvent) => {
      const eClient = { x: e.clientX, y: e.clientY, };
      const diff = subtract(eClient, s);
      this.#base.ref.current.updatePosStyle(add(diff, pos));
      this.#in.forEach(ic=>{ ic.ref.current.changeViewWithDiff(false, diff); });
      this.#out.forEach(oc=>{ oc.ref.current.changeViewWithDiff(true, diff); });
    }
    const mouseup = (e: MouseEvent) => {
      const eClient = { x: e.clientX, y: e.clientY, };
      const diff = subtract(eClient, s);
      if (this.#base.ref.current.updatePosState(add(diff, pos))) {
        this.#in.forEach(ic=>{ ic.ref.current.setPosWithDiff(false, diff)});
        this.#out.forEach(oc=>{ oc.ref.current.setPosWithDiff(true, diff)});
      } else {
        this.#openCP(this.#base.id);
      }
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
      this.#isSizeChanging = true;
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }
  sizeChange: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    this.onMouseMove(e);
    // if (!this.#isSizeChanging) return;
    // const s = {x: e.clientX, y: e.clientY };
    // const mousemove = (e: MouseEvent) => {
    //   const eClient = { x: e.clientX, y: e.clientY, };
    //   const diff = subtract(eClient, s);
    //   this.#base.ref.current.updateSizeStyle();
    //   this.#in.forEach(ic=>{ ic.ref.current.changeViewWithDiff(false, {x: 0, y: diff.y}); });
    //   this.#out.forEach(oc=>{ oc.ref.current.changeViewWithDiff(true, diff); });
    // }
    // const mouseup = (e: MouseEvent) => {
    //   const eClient = { x: e.clientX, y: e.clientY, };
    //   const diff = subtract(eClient, s);
    //   if (this.#base.ref.current.updateSizeState()) {
    //     this.#in.forEach(ic=>{ ic.ref.current.setPosWithDiff(false, {x: 0, y: diff.y})});
    //     this.#out.forEach(oc=>{ oc.ref.current.setPosWithDiff(true, diff)});
    //   }
    //   window.removeEventListener('mousemove', mousemove);
    //   window.removeEventListener('mouseup', mouseup);
    // }
    // window.addEventListener('mousemove', mousemove);
    // window.addEventListener('mouseup', mouseup);
  }

  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const m = {x: e.clientX, y: e.clientY };
    const left = bcr.x, right = bcr.x + bcr.width, top = bcr.y, bottom = bcr.y + bcr.height;
    const isLeftSide = left - border < m.x && m.x < left + border, isRightSide = right - border < m.x && m.x < right + border;
    const isUpperSide = top - border < m.x && m.x < top + border, isLowerSide = bottom - border < m.x && m.x < bottom + border;
    let cursor;
    if (isLeftSide || isRightSide || isUpperSide || isLowerSide) {
      cursor = (isLeftSide && isUpperSide) || (isRightSide && isLowerSide) ? 'nwse' :
        (isLeftSide && isLowerSide) || (isRightSide && isUpperSide) ? 'nesw' :
        isLeftSide || isRightSide ? 'ew' : 'ns';
      cursor = `${cursor}-resize`;
    } else {
      cursor = 'default';
    }
    console.log(cursor);
    e.currentTarget.style.cursor = cursor;
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
