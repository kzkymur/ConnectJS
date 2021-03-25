import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'; 
import { useDispatch } from 'react-redux';
import { Content } from '@/store/node/types';
import { updateAction, updateSizeAction, updatePosAction } from '@/store/node/actions';
import Header from './Header';
import Main from './Main';
import IOs from './IOs';
import { px2n, Vector } from '@/utils';
import style, { optionalbarHeight } from '@/style/Base.scss';
const optBarHeight = px2n(optionalbarHeight);

type Handler = {
  getJointPos: (isInput: boolean, id: number) => Vector;
  getAllJointPos: (isInput: boolean) => Vector[];
  getPos: () => Vector;
  getSize: () => Vector;
  updatePosStyle: (v: Vector) => void;
  updatePosState: (v: Vector) => boolean;
  updateSizeState: (v: Vector) => boolean;
}
type Props = {
  property: Content;
  openCP: () => void;
}

const Base = forwardRef<Handler, Props>((props, fRef) => {
  let { property } = props;
  let [ ref ] = useState<React.RefObject<HTMLDivElement>>(React.createRef<HTMLDivElement>());
  const { id } = property;
  let element: React.ReactNode;
  const dispatch = useDispatch();
  const updateFunc = (c: Content) => dispatch(updateAction(c));
  const updateSize = (width: string, height: string) => dispatch(updateSizeAction(id, width, height));
  const updatePos = (top: string, left: string) => dispatch(updatePosAction(id, top, left));
  let baseStyle: Content = property;
  // let inNameBox = false;
  // const setInNameBox = (newInNameBox: boolean) => inNameBox = newInNameBox;
  // let startX: number; let startY: number;

  // const startMoving = (e: React.MouseEvent) => {
  //   if (ref.current === null) return; const elm = ref.current;
  //   startX = e.clientX - elm.offsetLeft;
  //   startY = e.clientY - elm.offsetTop;
  //   elm.style.zIndex = String(-1 * elm.offsetWidth * elm.offsetHeight + 1);
  //   window.addEventListener('mousemove', moving);
  // }
  // const moving = (e: MouseEvent) => {
  //   const elm = ref.current;
  //   if (elm === null) return; 
  //   elm.style.left = (e.clientX - startX) + 'px';
  //   elm.style.top = (e.clientY - startY) + 'px';
  //   const height = elm.offsetHeight;
  //   if (mainRef.current === null) return;
  //   mainRef.current.style.height = (height - optBarHeight * (Math.max(property.inputs.length, property.outputs.length)+1)) + 'px';
  // }
  // const updateState = () => {
  //   window.removeEventListener('mousemove', moving);
  //   if (ref.current === null) return; const elm = ref.current;
  //   const width = elm.offsetWidth;
  //   const height = elm.offsetHeight;
  //   const zIndex = String(-1 * width * height);
  //   elm.style.zIndex = zIndex;
  //
  //   const strWidth = width + 'px';
  //   const strHeight = (height - optBarHeight * (Math.max(property.inputs.length, property.outputs.length)+1)) + 'px';
  //   const strTop = elm.offsetTop + 'px';
  //   const strLeft = elm.offsetLeft + 'px';
  //   if (baseStyle.width !== strWidth || baseStyle.height !== strHeight) return updateSize(strWidth, strHeight);
  //   else if (baseStyle.top !== strTop || baseStyle.left !== strLeft) return updatePos(strTop, strLeft);
  //
  //   if (inNameBox) {
  //     setInNameBox(false);
  //   } else {
  //     return props.openCP();
  //   }
  // }

  const getJointPos = (isInput: boolean, id: number) => {
    return {x: 0, y: 0};
  }
  const getAllJointPos = () => {
    return [{x: 0, y: 0}];
  }
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
    elm.style.left = v.x + 'px';
    elm.style.top = v.y + 'px';
  }
  const updatePosState = (v: Vector) => {
    const elm = ref.current; if (elm === null) return false; 
    const strTop = elm.offsetTop + 'px';
    const strLeft = elm.offsetLeft + 'px';
    if (baseStyle.top !== strTop || baseStyle.left !== strLeft) {
      updatePos(strTop, strLeft);
      return true;
    }
    return false;
  }
  const updateSizeState = (v: Vector) => {
    const elm = ref.current; if (elm === null) return false; 
    const width = elm.offsetWidth, height = elm.offsetHeight;
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
    // startMoving,
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
      /* onMouseUp={updateState} */
      >
      <Header {...headerProps}/>
      <Main {...mainProps}/>
      <IOs {...IOsProps}/>
    </div>
  )
});

export default Base;
