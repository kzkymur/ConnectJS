import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react'; 
import { DataType } from '@/store/node/types';
import style from '@/style/Connection.scss';

type Props = {
  type: DataType;
  curving: number;
  sX: number;
  sY: number;
  eX: number;
  eY: number;
}

type Handler = {
  changeView: (Sx:number, Sy:number, Ex:number, Ey:number) => void;
  setPos: (Sx:number, Sy:number, Ex:number, Ey:number) => void;
  getPos: (isStartPos: boolean) => number[];
}

const Connection = forwardRef<Handler, Props>((props, fRef) => {
  const [ref] = useState(useRef<SVGPathElement>(null));
  const [sX, setSX] = useState(props.sX);
  const [sY, setSY] = useState(props.sY);
  const [eX, setEX] = useState(props.eX);
  const [eY, setEY] = useState(props.eY);
  useImperativeHandle(fRef, ()=>({
    changeView,
    setPos,
    getPos,
  }));

  const changeView = (Sx: number, Sy: number, Ex: number, Ey: number) => {
    if (ref.current === null) return;
    ref.current.attributes[1].value = calcDList(Sx,Sy,Ex,Ey,props.curving);
  }
  const setPos = (Sx: number, Sy: number, Ex: number, Ey: number) => {
    if (Sx !== sX) setSX(Sx);
    if (Sy !== sY) setSY(Sy);
    if (Ex !== eX) setEX(Ex);
    if (Ey !== eY) setEY(Ey);
  }
  const getPos = (isStartPos: boolean) => isStartPos ? [sX, sY] : [eX, eY];

  return (
    <path className={style.connectionLine} ref={ref}
      d={calcDList(sX, sY, eX, eY, props.curving)}/>	
  );
})

export default Connection;

const calcDList = (Sx: number, Sy: number, Ex: number, Ey: number, curving: number) => {
  let dList :(number | string)[] = ['M']; dList[3] = 'Q'; dList[8] = 'T';
  dList[1] = Sx; dList[2] = Sy; dList[9] = Ex; dList[10] = Ey;
  dList[4] = Math.abs((Ex-Sx)*curving)+Sx; dList[5] = Sy;
  dList[6] = (Sx + Ex) / 2; dList[7] = (Sy + Ey) / 2;
  return dList.join(' ');
}
