import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, MutableRefObject } from 'react';
import { useDispatch } from 'react-redux';
import { BaseType } from '@/store/node/types';
import { updateAction, updateSizeAction, updatePosAction } from '@/store/node/actions';
import Header from './Header';
import Main from './Main';
import IOs, { Handler as IOsHandler } from './IOs';
import { px2n } from '@/utils';
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
  updateSizeState: (v: Vector) => boolean;
}
export type Props = {
  property: BaseType;
  posChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  sizeChange: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Base = forwardRef<Handler, Props>((props, fRef) => {
  let { property } = props;
  const [ ref ] = useState<React.RefObject<HTMLDivElement>>(React.createRef<HTMLDivElement>());
  const [ iosRef ] = useState<MutableRefObject<IOsHandler>>(useRef({} as IOsHandler));
  const { id } = property;
  let element: React.ReactNode;
  const dispatch = useDispatch();
  const updateFunc = (c: BaseType) => dispatch(updateAction(c));
  const updateSize = (width: string, height: string) => dispatch(updateSizeAction(id, width, height));
  const updatePos = (top: string, left: string) => dispatch(updatePosAction(id, top, left));
  let baseStyle: BaseType = property;

  const getJointPos = (isInput: boolean, id: number) => iosRef.current.getJointPos(isInput, id);
  const getAllJointPos = (isInput: boolean) => iosRef.current.getAllJointPos(isInput);
  const getPos = () => {
    const v = {x: 0, y: 0};
    const elm = ref.current; if (elm === null) return v; 
    v.x = elm.offsetLeft, v.y = elm.offsetTop;
    return v;
  }
  const getSize = () => {
    const v = {x: 0, y: 0};
    const elm = ref.current; if (elm === null) return v; 
    v.x = elm.offsetWidth, v.y = elm.offsetHeight - optBarHeight * (Math.max(property.inputs.length, property.outputs.length)+1);
    return v;
  }
  const updatePosStyle = (v: Vector) => {
    const elm = ref.current; if (elm === null) return; 
    elm.style.left = v.x + 'px', elm.style.top = v.y + 'px';
  }
  const updatePosState = (v: Vector) => {
    const strLeft = v.x + 'px', strTop = v.y + 'px';
    if (baseStyle.top !== strTop || baseStyle.left !== strLeft) {
      updatePos(strTop, strLeft);
      return true;
    }
    return false;
  }
  const updateSizeState = (v: Vector) => {
    const elm = ref.current; if (elm === null) return false; 
    // const width = elm.offsetWidth, height = elm.offsetHeight;
    const width = v.x, height = v.y;
    elm.style.zIndex = String(-1 * width * height);
    const strWidth = width + 'px';
    const strHeight = (height - optBarHeight * (Math.max(property.inputs.length, property.outputs.length)+1)) + 'px';
    if (baseStyle.width !== strWidth || baseStyle.height !== strHeight) {
      updateSize(strWidth, strHeight);
      return true;
    }
    return false;
  }

  useImperativeHandle(fRef, ()=>({
    getJointPos,
    getAllJointPos,
    getPos,
    getSize,
    updatePosStyle,
    updatePosState,
    updateSizeState,
  }));

  const createIONameUpdate = (isInput: boolean, index: number) => {
    const ioNameUpdate = (name: string) => {
      const newProperty: BaseType = isInput ? {
        ...property,
        inputs: property.inputs.map((input, i) => {
          if (i===index) {
            input.name = name;
            return input;
          } else {
            return input;
          }
        }) 
      } : {
        ...property,
        outputs: property.outputs.map((output, i) => {
          if (i===index) {
            return {
              ...output,
              name: name,
            };
          } else {
            return output;
          }
        }) 
      };
      updateFunc(newProperty);
    }
    return ioNameUpdate;
  }

  const [ mainRef ] = useState(useRef<HTMLDivElement>(null));
  useEffect(()=>{
    let elm;
    if (ref.current === null) return; elm = ref.current;
    elm.style.width = property.width;
    elm.style.top = property.top;
    elm.style.left = property.left;
    elm.style.opacity = '1';
    if (mainRef.current === null) return; elm = mainRef.current;
    elm.style.height = property.height;
  })
  const headerProps = {
    id,
    name: property.name,
  };
  const mainProps = {
    posChange: props.posChange,
    element,
    fRef: mainRef
  };
  const IOsProps = {
    id, 
    inputs: property.inputs,
    outputs: property.outputs,
    createIONameUpdate,
  };
  return (
    <div className={style.container} ref={ref}
      onMouseDown={props.sizeChange}
    >
      <Header {...headerProps}/>
      <Main {...mainProps}/>
      <IOs {...IOsProps} ref={iosRef}/>
    </div>
  )
});

export default Base;
