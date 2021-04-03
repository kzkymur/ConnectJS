import React, { MutableRefObject } from 'react';
import { BaseType, ConnectionType } from '@/store/node/types';
import { Handler as ConnectionHandler } from '@/component/Connection';
import { Handler as BaseHandler, Props as BaseProps } from '@/component/Base';
import { add, subtract } from '@/utils/vector';

class Props {
  #base: BaseType & { ref: MutableRefObject<BaseHandler>; };
  #in: ConnectionInfo[]; 
  #out: ConnectionInfo[];
  #openCP: (id:number)=>void;
  #flag: boolean = true;
  readonly property: BaseType;

  constructor (
    base: BaseType & { ref: MutableRefObject<BaseHandler>; },
    inputConnections: ConnectionInfo[],
    outputConnections: ConnectionInfo[],
    openCP: (id:number)=>void
  ) {
    this.#base = base;
    this.property = base;
    this.#in = inputConnections;
    this.#out = outputConnections;
    this.#openCP = openCP;
  }

  posChange: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    this.#flag = false;
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
      this.#flag = true;
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }
  sizeChange: (e: React.MouseEvent<HTMLDivElement>) => void = e => {
    if (!this.#flag) return;
    const s = {x: e.clientX, y: e.clientY };
    const mousemove = (e: MouseEvent) => {
      const eClient = { x: e.clientX, y: e.clientY, };
      const diff = subtract(eClient, s);
      this.#in.forEach(ic=>{ ic.ref.current.changeViewWithDiff(false, {x: 0, y: diff.y}); });
      this.#out.forEach(oc=>{ oc.ref.current.changeViewWithDiff(true, diff); });
    }
    const mouseup = (e: MouseEvent) => {
      const eClient = { x: e.clientX, y: e.clientY, };
      const diff = subtract(eClient, s);
      if (this.#base.ref.current.updateSizeState()) {
        this.#in.forEach(ic=>{ ic.ref.current.setPosWithDiff(false, {x: 0, y: diff.y})});
        this.#out.forEach(oc=>{ oc.ref.current.setPosWithDiff(true, diff)});
      }
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }
}

export type ConnectionInfo = ConnectionType & { ref: MutableRefObject<ConnectionHandler>; };

export default function baseProps (
  base: BaseType & { ref: MutableRefObject<BaseHandler>; },
  inputConnections: ConnectionInfo[],
  outputConnections: ConnectionInfo[],
  openCP: (id:number)=>void
): BaseProps {
  const obj = new Props(base, inputConnections, outputConnections, openCP);
  return { ...obj };
}
