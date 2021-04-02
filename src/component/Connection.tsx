import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react'; 
import { DataType } from '@/store/node/types';
import Vector, { add } from '@/utils/vector';
import style from '@/style/Connection.scss';

export type Handler = {
  changeView: (start: Vector, end: Vector) => void;
  changeViewWithDiff: (isInput: boolean, diff: Vector) => void;
  setPos: (start: Vector, end: Vector) => void;
  setPosWithDiff: (isInput: boolean, diff: Vector) => void;
  getPos: () => { start: Vector; end: Vector };
}
type Props = {
  type: DataType;
  curving: number;
  s: Vector;
  e: Vector;
}

const Connection = forwardRef<Handler, Props>((props, fRef) => {
  const ref = useRef<SVGPathElement>(null);
  const [s, setS] = useState(props.s);
  const [e, setE] = useState(props.e);
  useImperativeHandle(fRef, ()=>({
    changeView,
    changeViewWithDiff,
    setPos,
    setPosWithDiff,
    getPos,
  }));

  const changeView = (s: Vector, e: Vector) => {
    ref.current!.attributes[1].value = calcDList(s,e,props.curving);
  }
  const changeViewWithDiff = (isInput: boolean, diff: Vector) => {
    ref.current!.attributes[1].value = isInput ? calcDList(add(s,diff),e,props.curving) : calcDList(s,add(e,diff),props.curving);
  }
  const setPos = (newS: Vector, newE: Vector) => {
    if (s !== newS) setS(newS);
    if (e !== newE) setE(newE);
  }
  const setPosWithDiff = (isInput: boolean, diff: Vector) => {
    if (isInput) setS(add(getPos().start, diff));
    else setE(add(getPos().end, diff));
  }
  const getPos = () => ({ start: s, end: e, });

  return (
    <path className={style.connectionLine} ref={ref}
      d={calcDList(s, e, props.curving)}/>	
  );
})

export default Connection;

const calcDList = (s: Vector, e: Vector, curving: number) => {
  let dList :(number | string)[] = ['M']; dList[3] = 'Q'; dList[8] = 'T';
  dList[1] = s.x; dList[2] = s.y; dList[9] = e.x; dList[10] = e.y;
  dList[4] = Math.abs((e.x-s.x)*curving)+s.x; dList[5] = s.y;
  dList[6] = (s.x + e.x) / 2; dList[7] = (s.y + e.y) / 2;
  return dList.join(' ');
}
