import React, { useRef, useImperativeHandle, forwardRef } from 'react'; 
import { DataType } from '@/store/main/node';
import Vector, { add } from '@/utils/vector';
import style from '@/style/Connection.scss';

export type Handler = {
  changeView: (start: Vector, end: Vector) => void;
  changeViewWithDiff: (isInput: boolean, diff: Vector) => void;
  setType: (type: DataType) => void;
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
  let s = props.s, e = props.e;
  useImperativeHandle(fRef, ()=>({
    changeView,
    changeViewWithDiff,
    setType,
    getPos,
  }));

  const changeView = (s: Vector, e: Vector) => {
    ref.current!.attributes[1].value = calcDList(s,e,props.curving);
  }
  const changeViewWithDiff = (isInput: boolean, diff: Vector) => {
    if (isInput) s = add(s,diff);
    else e = add(e,diff);
    ref.current!.attributes[1].value = calcDList(s,e,props.curving);
  }
  const setType = (type: DataType) => {
    // update();
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
