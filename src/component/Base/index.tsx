import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { BaseType, Socket } from '@/store/node/types';
import { updateAction, updateSizeAction, updatePosAction } from '@/store/node/actions';
import Header from './Header';
import Main from './Main';
import IOs, { Handler as IOsHandler } from './IOs';
import { px, px2n } from '@/utils';
import Vector from '@/utils/vector';
import style, { optionalbarHeight } from '@/style/Base.scss';
const optBarHeight = px2n(optionalbarHeight);

export type Handler = {
  getJointPos: (isInput: boolean, id: number) => Vector;
  getAllJointPos: (isInput: boolean) => Vector[];
  getPos: () => Vector;
  getSize: () => Vector;
  updatePosStyle: (v: Vector) => void;
  updatePosState: (v: Vector) => boolean;
  updateSizeStyle: () => void;
  updateSizeState: () => boolean;
}
export type Props = {
  property: BaseType;
  posChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  sizeChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  operateNewConnection: (isInput: boolean, id: number) => () => void;
  registerNewConnection: (isInput: boolean, id: number) => () => void;
}

const Base = forwardRef<Handler, Props>((props, fRef) => {
  const { property } = props;
  const [ ref ] = useState(React.useRef<HTMLDivElement>({} as HTMLDivElement));
  const [ iosRef ] = useState(useRef({} as IOsHandler));
  const { id, inputs, outputs, width, top, left, name, height } = property;
  let element: React.ReactNode;
  const dispatch = useDispatch();
  const updateFunc = (c: BaseType) => dispatch(updateAction(c));
  const updateSize = (width: string, height: string) => dispatch(updateSizeAction(id, width, height));
  const updatePos = (top: string, left: string) => dispatch(updatePosAction(id, top, left));
  let baseStyle: BaseType = property;
  const [ mainRef ] = useState(useRef<HTMLDivElement>({} as HTMLDivElement));

  const getJointPos = (isInput: boolean, id: number) => iosRef.current.getJointPos(isInput, id);
  const getAllJointPos = (isInput: boolean) => iosRef.current.getAllJointPos(isInput);
  const getPos = () => ({ x: ref.current.offsetLeft, y: ref.current.offsetTop});
  const getSize = () => ({ x: ref.current.offsetWidth, y: ref.current.offsetHeight - optBarHeight * (Math.max(inputs.length, outputs.length)+1)});
  const updatePosStyle = (v: Vector) => { ref.current.style.left = px(v.x), ref.current.style.top = px(v.y); }
  const updatePosState = (v: Vector) => {
    const strLeft = px(v.x), strTop = px(v.y);
    if (baseStyle.top !== strTop || baseStyle.left !== strLeft) {
      updatePos(strTop, strLeft);
      return true;
    }
    return false;
  }
  const updateSizeStyle = () => { mainRef.current.style.height = px(calcMainHeight(ref.current.offsetHeight, inputs, outputs)); }
  const updateSizeState = () => {
    const width = ref.current.offsetWidth, height = ref.current.offsetHeight;
    ref.current.style.zIndex = String(-1 * width * height);
    const strWidth = px(width);
    const strHeight = px(calcMainHeight(height, inputs, outputs));
    if (baseStyle.width !== strWidth || baseStyle.height !== strHeight) {
      updateSize(strWidth, strHeight);
      return true;
    }
    return false;
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
      onMouseDown={props.sizeChange}
    >
      <Header {...headerProps(id, name)}/>
      <Main {...mainProps(props.posChange, element, mainRef)}/>
      <IOs {...IOsProps(id, inputs, outputs, createIONameUpdate, props.operateNewConnection, props.registerNewConnection)} ref={iosRef}/>
    </div>
  )
});

export default Base;

const calcMainHeight = (height: number, inputs: Array<Socket>, outputs: Array<Socket>): number => (height - optBarHeight * (Math.max(inputs.length, outputs.length)+1));

const headerProps = (id: number, name: string) => ({ id, name, });
const mainProps = (posChange: (e: React.MouseEvent<HTMLDivElement>) => void, element: React.ReactNode, fRef: React.RefObject<HTMLDivElement>) => ({ element, posChange, fRef });
const IOsProps = (id: number, inputs: Socket[], outputs: Socket[], createIONameUpdate: (isInput: boolean, index: number) => (name: string) => void, operateNewConnection: (isInput: boolean ,id: number) => () => void, registerNewConnection: (isInput: boolean ,id: number) => () => void) => ({ id, inputs, outputs, createIONameUpdate, operateNewConnection, registerNewConnection });

