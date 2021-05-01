import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, ReactNode, RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { BaseType, Socket } from '@/store/node/types';
import { updateAction, updateSizeAction, updatePosAction, multAction } from '@/store/node/actions';
import Header from './Header';
import Main from './Main';
import IOs, { Handler as IOsHandler } from './IOs';
import { px, px2n } from '@/utils';
import Vector from '@/utils/vector';
import { minBaseWidth, minBaseHeight } from '@/config';
import style, { optionalbarHeight } from '@/style/Base.scss';
const optBarHeight = px2n(optionalbarHeight);

export type Handler = {
  getJointPos: (isInput: boolean, id: number) => Vector;
  getAllJointPos: (isInput: boolean) => Vector[];
  getPos: () => Vector;
  getSize: () => Vector;
  updatePosStyle: (v: Vector) => boolean;
  updatePosState: () => boolean;
  updateSizeStyle: (v: Vector) => Vector;
  updateSizeState: () => Vector;
}
export type Props = {
  property: BaseType;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  operateNewConnection: (isInput: boolean, id: number) => () => void;
  registerNewConnection: (isInput: boolean, id: number) => () => void;
}

const Base = forwardRef<Handler, Props>((props, fRef) => {
  const { property } = props;
  const [ ref ] = useState(useRef<HTMLDivElement>({} as HTMLDivElement));
  const [ iosRef ] = useState(useRef({} as IOsHandler));
  const { id, inputs, outputs, width, top, left, name, height } = property;
  let element: ReactNode;
  const dispatch = useDispatch();
  const updateFunc = (c: BaseType) => dispatch(updateAction(c));
  const updateSize = (width: string, height: string, top: string, left: string) => dispatch(multAction([
      updatePosAction(id, top, left),
      updateSizeAction(id, width, height),
    ]));
  const updatePos = (top: string, left: string) => dispatch(updatePosAction(id, top, left));
  let baseStyle: BaseType = property;
  const [ mainRef ] = useState(useRef<HTMLDivElement>({} as HTMLDivElement));

  const getJointPos = (isInput: boolean, id: number) => iosRef.current.getJointPos(isInput, id);
  const getAllJointPos = (isInput: boolean) => iosRef.current.getAllJointPos(isInput);
  const getPos = () => ({ x: ref.current.offsetLeft, y: ref.current.offsetTop });
  const getSize = () => ({ x: ref.current.offsetWidth, y: ref.current.offsetHeight });
  const updatePosStyle = (v: Vector) => {
    const bcr = ref.current.getBoundingClientRect();
    v = { x: v.x+bcr.left, y: v.y+bcr.top, };
    if (px(v.x) == ref.current.style.left && px(v.y) == ref.current.style.top) return false;
    ref.current.style.left = px(v.x), ref.current.style.top = px(v.y);
    return true;
  }
  const updatePosState = () => {
    const top = ref.current.style.top, left = ref.current.style.left;
    if (baseStyle.top !== top || baseStyle.left !== left) {
      updatePos(top, left);
      return true;
    }
    return false;
  }
  const updateSizeStyle = (v: Vector) => {
    const f = { x: 1, y: 1 };
    v = { x: Math.max(v.x+px2n(ref.current.style.width), minBaseWidth), y: Math.max(v.y+px2n(ref.current.style.height), minBaseHeight) };
    if (v.x === minBaseWidth) f.x = 0;
    if (v.y === minBaseHeight) f.y = 0;
    mainRef.current.style.height = px(calcMainHeight(v.y, inputs, outputs));
    ref.current.style.zIndex = String(-1 * v.x * v.y);
    ref.current.style.width = px(v.x), ref.current.style.height = px(v.y);
    return f;
  }
  const updateSizeState = () => {
    const bcr = ref.current.getBoundingClientRect();
    const v = { x: bcr.width, y: bcr.height };
    ref.current.style.zIndex = String(-1 * v.x * v.y);
    const width = px(v.x), height = px(calcMainHeight(v.y, inputs, outputs));
    const top = ref.current.style.top, left = ref.current.style.left;
    const f = { x: Number(baseStyle.width !== width), y: Number(baseStyle.height !== height) };
    if (f.x || f.y) updateSize(width, height, top, left);
    return f;
  }
  const keepSizeStyle = () => {
    mainRef.current.style.height = height;
    ref.current.style.height = px(px2n(height) + optBarHeight * (Math.max(inputs.length, outputs.length)+1));
  }
  useImperativeHandle(fRef, ()=>({
    getJointPos,
    getAllJointPos,
    getPos,
    getSize,
    updatePosStyle,
    updatePosState,
    updateSizeStyle,
    updateSizeState,
  }));

  useEffect(()=>{
    let elm;
    elm = ref.current;
    elm.style.width = width;
    elm.style.top = top;
    elm.style.left = left;
    elm.style.opacity = '1';
    keepSizeStyle();
  })

  const createIONameUpdate = (isInput: boolean, index: number) => (name: string) => {
    const newProperty: BaseType = {...property};
    const sockets = isInput ? inputs : outputs;
    const key = isInput ? 'inputs' : 'outputs';
    newProperty[key] = sockets.map((s, i) => {
      if (i===index) s.name = name;
      return s;
    }) 
    updateFunc(newProperty);
  }
  return (
    <div className={style.container} ref={ref}
      onMouseDown={props.onMouseDown}
      onMouseMove={props.onMouseMove}
    >
      <Header {...headerProps(id, name)}/>
      <Main {...mainProps(element, mainRef)}/>
      <IOs {...IOsProps(id, inputs, outputs, createIONameUpdate, props.operateNewConnection, props.registerNewConnection)} ref={iosRef}/>
    </div>
  )
});

export default Base;

const calcMainHeight = (height: number, inputs: Array<Socket>, outputs: Array<Socket>): number => (height - optBarHeight * (Math.max(inputs.length, outputs.length)+1));

const headerProps = (id: number, name: string) => ({ id, name, });
const mainProps = (element: ReactNode, fRef: RefObject<HTMLDivElement>) => ({ element, fRef });
const IOsProps = (id: number, inputs: Socket[], outputs: Socket[], createIONameUpdate: (isInput: boolean, index: number) => (name: string) => void, operateNewConnection: (isInput: boolean ,id: number) => () => void, registerNewConnection: (isInput: boolean ,id: number) => () => void) => ({ id, inputs, outputs, createIONameUpdate, operateNewConnection, registerNewConnection });
