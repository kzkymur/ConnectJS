import React, { useEffect, useRef, useImperativeHandle, forwardRef, RefObject, } from 'react';
import { useDispatch } from 'react-redux';
import { Node as NodeType, Socket, ResizableNode } from '@/store/main/node';
import { updateAction } from '@/store/main/actions';
import Header from './Header';
import Main from './Main';
import IOs, { Handler as IOsHandler } from './IOs';
import Content from '@/content';
import { px, px2n } from '@/utils';
import Vector from '@/utils/vector';
import { minBaseWidth, minBaseHeight, optBarHeight, borderWidth } from '@/config';
import style from '@/style/Node.scss';

export type Handler = {
  getJointPos: (isInput: boolean, id: number) => Vector;
  getAllJointPos: (isInput: boolean) => Vector[];
  getPos: () => Vector;
  getSize: () => Vector;
  updatePosStyle: (v: Vector) => boolean;
  updateSizeStyle: (v: Vector) => Vector;
}
export type Props = {
  property: NodeType;
  resizable: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  operateNewConnection: (isInput: boolean, id: number) => () => void;
  registerNewConnection: (isInput: boolean, id: number) => () => void;
  deleteFunc: () => void;
}

const Node = forwardRef<Handler, Props>((props, fRef) => {
  const { property, resizable } = props;
  const ref = useRef<HTMLDivElement>({} as HTMLDivElement);
  const iosRef = useRef({} as IOsHandler);
  const { id, inputs, outputs, top, left, name } = property;
  const dispatch = useDispatch();
  const updateFunc = (n: NodeType) => dispatch(updateAction(n));
  const mainRef = useRef<HTMLDivElement>({} as HTMLDivElement);

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
  const updateSizeStyle = (v: Vector) => {
    if (!resizable) return { x: 0, y: 0 };
    const updated = { x: 1, y: 1 };
    v = { x: Math.max(v.x+px2n(ref.current.style.width), minBaseWidth), y: Math.max(v.y+px2n(ref.current.style.height), minBaseHeight) };
    if (v.x === minBaseWidth) updated.x = 0;
    if (v.y === minBaseHeight) updated.y = 0;
    mainRef.current.style.height = px(calcMainHeight(v.y, inputs, outputs));
    ref.current.style.zIndex = String(-1 * v.x * v.y);
    ref.current.style.width = px(v.x), ref.current.style.height = px(v.y);
    return updated;
  }
  useImperativeHandle(fRef, ()=>({
    getJointPos,
    getAllJointPos,
    getPos,
    getSize,
    updatePosStyle,
    updateSizeStyle,
  }));

  useEffect(()=>{
    const elm = ref.current;
    elm.style.top = top;
    elm.style.left = left;
    elm.style.opacity = '1';
    if (resizable) {
      const { width, height } = property as ResizableNode;
      elm.style.width = px(px2n(width)-borderWidth*2);
      mainRef.current.style.height = px(px2n(height) - borderWidth * 2);
      ref.current.style.height = px(px2n(height) + optBarHeight * (Math.max(inputs.length, outputs.length)+1) - borderWidth * 2);
    }
  })

  const createIONameUpdate = (isInput: boolean, index: number) => (name: string) => {
    // const newProperty: NodeType = {...property};
    // const sockets = isInput ? inputs : outputs;
    // const key = isInput ? 'inputs' : 'outputs';
    // newProperty[key] = sockets.map((s, i) => {
    //   if (i===index) s.name = name;
    //   return s;
    // })
    // updateFunc(newProperty);
  }
  return (
    <div className={`${style.container} ${resizable ? style.resizable : ''}`} ref={ref}
      onMouseDown={props.onMouseDown}
      onMouseMove={props.onMouseMove}
    >
      <Header {...headerProps(id, name, props.deleteFunc)}/>
      <Main {...mainProps(mainRef)}>
        <Content mode={property.mode}/>
      </Main>
      <IOs {...IOsProps(id, inputs, outputs, createIONameUpdate, props.operateNewConnection, props.registerNewConnection)} ref={iosRef}/>
    </div>
  );
});

export default Node;

const calcMainHeight = (height: number, inputs: Array<Socket>, outputs: Array<Socket>): number => (height - optBarHeight * (Math.max(inputs.length, outputs.length)+1));

const headerProps = (id: number, name: string, deleteFunc: ()=>void) => ({ id, name, deleteFunc, });
const mainProps = (fRef: RefObject<HTMLDivElement>) => ({ fRef });
const IOsProps = (id: number, inputs: Socket[], outputs: Socket[], createIONameUpdate: (isInput: boolean, index: number) => (name: string) => void, operateNewConnection: (isInput: boolean ,id: number) => () => void, registerNewConnection: (isInput: boolean ,id: number) => () => void) => ({ id, inputs, outputs, createIONameUpdate, operateNewConnection, registerNewConnection });
