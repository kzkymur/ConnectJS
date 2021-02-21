import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Content } from '@/store/types';
import { updateAction } from '@/store/actions';
import Header from './Header';
import Main from './Main';
import IOs from './IOs';
import { px2n } from '@/utils';
import style, { optionalbarHeight } from '@/style/Base.scss';
const optBarHeight = px2n(optionalbarHeight);

type Props = {
  property: Content;
  fRef: React.RefObject<HTMLDivElement>;
  startMoving: (startPosX: number, startPosY: number) => void;
  createStartConnectionMoving: (isInput: boolean, channel: number, isConnected: boolean) => (e: React.MouseEvent<HTMLDivElement>) => void;
  createAddConnection: (isInput: boolean, channel: number) => () => void;
  openCP: () => void;
  delete: () => void;
}

const Base: React.FC<Props> = props => {
  let {fRef, property} = props;
  let element: React.ReactNode;
  const dispatch = useDispatch();
  const updateFunc = (c: Content) => dispatch(updateAction(c));
  let baseStyle: Content = property;
  const checkPropNames: string[] = ['width', 'height', 'top', 'left'];
  const isProperty = (value: string): value is (keyof Content) => checkPropNames.includes(value);
  let inNameBox = false;
  const setInNameBox = (newInNameBox: boolean) => inNameBox = newInNameBox;

  const updateState = () => {
    if (fRef.current === null) return; const elm = fRef.current;
    const width = elm.offsetWidth;
    const height = elm.offsetHeight;
    const zIndex = String(-1 * width * height);
    elm.style.zIndex = zIndex;
    const newBaseStyle: Content = {
      ...property,
      width: width + 'px',
      height: (height - optBarHeight * (Math.max(property.inputs.length, property.outputs.length)+1)) + 'px',
      top: elm.offsetTop + 'px',
      left: elm.offsetLeft + 'px',
    }
    for (let key in baseStyle) {
      if (isProperty(key)) {
        if (baseStyle[key] !== newBaseStyle[key]) {
          baseStyle = newBaseStyle;
          return updateFunc(newBaseStyle);
        }
      }
    }
    if (inNameBox) {
      setInNameBox(false);
    } else {
      return props.openCP();
    }
  }
  const createIONameUpdate = (isInput: boolean, index: number) => {
    const ioNameUpdate = (name: string) => {
      const newProperty: Content = isInput ? {
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

  const startMoving = (e: React.MouseEvent) => {
    if (fRef.current === null) return; const elm = fRef.current;
    props.startMoving(e.clientX - elm.offsetLeft, e.clientY - elm.offsetTop);
    elm.style.zIndex = String(-1 * elm.offsetWidth * elm.offsetHeight + 1);
  }

  const [ mainRef ] = useState(useRef<HTMLDivElement>(null));
  useEffect(()=>{
    let elm;
    if (fRef.current === null) return; elm = fRef.current;
    elm.style.width = property.width;
    elm.style.top = property.top;
    elm.style.left = property.left;
    elm.style.opacity = '1';
    if (mainRef.current === null) return; elm = mainRef.current;
    elm.style.height = property.height;
  })
  const displayUpdate = () => {
    if (fRef.current === null) return; const height = fRef.current.offsetHeight;
    if (mainRef.current === null) return; let elm = mainRef.current;
    elm.style.height = (height - optBarHeight * (Math.max(property.inputs.length, property.outputs.length)+1)) + 'px';
  }
  const headerProps = {
    property,
    updateFunc,
    delete: props.delete,
  }
  const mainProps = {
    startMoving,
    element,
    fRef: mainRef
  }
  const IOsProps = {
    inputs: property.inputs,
    outputs: property.outputs,
    createStartConnectionMoving: props.createStartConnectionMoving,
    createAddConnection: props.createAddConnection,
    createIONameUpdate,
  }
  return (
    <div className={style.container} ref={fRef} onMouseMove={displayUpdate} onMouseUp={updateState}>
      <Header {...headerProps}/>
      <Main {...mainProps}/>
      <IOs {...IOsProps}/>
    </div>
  )
}

export default Base;
