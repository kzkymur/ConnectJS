import React from 'react';
import { useDispatch } from 'react-redux';
import { EditorModeNames, glEditor } from '../store/types';
import { updateAction } from '../store/actions';
import Canvas from './Canvas';
import NameBox from './NameBox';
import style from '@/style/Base.scss';

type Props = {
  property: glEditor;
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
  const updateFunc = (gle: glEditor) => dispatch(updateAction(gle));
  let baseStyle: glEditor = property;
  const checkPropNames: string[] = ['width', 'height', 'top', 'left'];
  const isProperty = (value: string): value is (keyof glEditor) => checkPropNames.includes(value);
  let inNameBox = false;
  const setInNameBox = (newInNameBox: boolean) => inNameBox = newInNameBox;

  const updateState = () => {
    if (fRef.current === null) return; const elm = fRef.current;
    const width = elm.offsetWidth;
    const height = elm.offsetHeight;
    const zIndex = String(-1 * width * height);
    elm.style.zIndex = zIndex;
    const newBaseStyle: glEditor = {
      ...property,
      width: width + 'px',
      height: height + 'px',
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
  const nameUpdate = (name: string) => {
    const newBaseStyle: glEditor = {
      ...property,
      name: name,
    };
    updateFunc(newBaseStyle);
  }

  const startMoving = (e: React.MouseEvent) => {
    if (fRef.current === null) return; const elm = fRef.current;
    props.startMoving(e.clientX - elm.offsetLeft, e.clientY - elm.offsetTop);
    elm.style.zIndex = String(-1 * elm.offsetWidth * elm.offsetHeight + 1);
  }

  switch(property.mode.name) {
    case EditorModeNames.Code:{
      element = (
        <Canvas render={()=>{}}/>
      )
      break;
    }
    default:{
      element = (
        <Canvas render={()=>{}}/>
      )
    }
  }
  const createIONameUpdate = (isInput: boolean, index: number) => {
    const ioNameUpdate = (name: string) => {
      const newProperty: glEditor = isInput ? {
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

  const nOptBar = Math.max(property.inputs.length, property.outputs.length);
  React.useEffect(()=>{
    if (fRef.current === null) return; const elm = fRef.current;
    elm.style.width = property.width;
    elm.style.height = property.height;
    elm.style.top = property.top;
    elm.style.left = property.left;
    elm.style.opacity = '1';
  }) 
  return (
    <div className={style.container} ref={fRef} onMouseUp={updateState}>
      <div className={style.baseHeader}>
        <NameBox className={style.nameBoxInBase}
          name={property.name}
          updateFunc={nameUpdate} 
          onMouseDown={()=>setInNameBox(true)}/>
        <button className={style.deleteButton}onClick={props.delete}>×</button>
      </div>
      <div className={style.baseMainOptbar} onMouseDown={startMoving}>
        {element}
      </div>
      <div className={style.ioareaContainer}>
        <div className={style.ioArea}>
          {property.inputs.map((input, i, inputs)=>(
            <div className={style.ioContainer} key={i}>
              <div className={style.jointContainer+' '+'input'} 
                onMouseDown={props.createStartConnectionMoving(true, i, input.oBaseId!==undefined)}
                onMouseUp={props.createAddConnection(true, i)}
                id={`iJoint-${property.baseId}-${i}`}>
                <div className={style.joint} />
              </div>
              <NameBox className={style.nameBoxInInput}
                name={input.name}
                updateFunc={createIONameUpdate(true, i)}/>
            </div>
          ))}
        </div>
        <div className={style.ioArea}>
          {property.outputs.map((output, i, outputs)=>(
            <div className={style.ioContainer} key={i}>
              <div className={style.jointContainer+' '+output}
                onMouseDown={props.createStartConnectionMoving(false, i, output.isConnected)}
                onMouseUp={props.createAddConnection(false, i)}
                id={`oJoint-${property.baseId}-${i}`}>
                <div className={style.joint} />
              </div>
              <NameBox className={style.nameBoxInOutput}
                name={output.name}
                updateFunc={createIONameUpdate(false, i)}/>
              <p className={style.outputValue}> </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Base;

