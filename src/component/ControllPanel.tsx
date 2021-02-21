import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Content, NodeModeNames, InputInfo, OutputInfo, OutputTypes, OutputType } from '@/store/node/types';
import { updateAction } from '@/store/node/actions';
import { closeCPAction, closeAllCPAction } from '@/store/panel/actions';
import NameBox from './atom/NameBox';
import style from '@/style/ControllPanel.css';

type Props = {
  properties: Content[];
  index: number;
  setIndex: (i: number) => void;
}

const ControlPanel: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const index = props.index;
  const updateFunc = (c: Content) => dispatch(updateAction(c));
  useEffect(()=>{
  }) 

  const nameUpdate = (name: string) => {
    const newBaseStyle: Content = {
      ...props.properties[index],
      name: name,
    };
    updateFunc(newBaseStyle);
  }
  const closeAllFunc = () => dispatch(closeAllCPAction());
  const createChangeIndexFunc = (newIndex: number) => {
    const changeIndexFunc = (e: React.MouseEvent<HTMLInputElement>) => {
      if (index!==newIndex) {
        e.preventDefault();
        props.setIndex(newIndex);
      }
    }
    return changeIndexFunc;
  }
  const createCloseFunc = (closeIndex: number) => {
    const closeFunc = () => {
      dispatch(closeCPAction(closeIndex));
      if (closeIndex===index) {
        props.setIndex(0);
      } else if (closeIndex < index) {
        props.setIndex(index-1);
      }
    }
    return closeFunc;
  }

  let defaultOutputType: OutputType;
  switch (props.properties[index].mode.name) {
    case NodeModeNames.Canvas: {
      defaultOutputType = OutputTypes.Framebuffer;
      break;
    }
    default: {
      defaultOutputType = OutputTypes.Number;
    }
  }
  const addInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const inputInfo: InputInfo = {
      type: defaultOutputType,
      name: 'value',
    }
    const newProperty: Content = {
      ...props.properties[index],
      inputs: [...props.properties[index].inputs, inputInfo]
    };
    updateFunc(newProperty);
  }
  const addOutput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const outputInfo: OutputInfo = {
      type: defaultOutputType,
      name: 'value',
      isConnected: false,
    }
    const newProperty: Content = {
      ...props.properties[index],
      outputs: [...props.properties[index].outputs, outputInfo]
    };
    updateFunc(newProperty);
  }

  let i = -1;
  return (
    <div className={style.controllPanel}>
      <div className={style.headerContainer}>
        {props.properties.map((property)=>{
          i++;
          return(
            <div className={`${style.cpTabContainer} ${i===index ? style.activeCPTabContainer : ''}`} key={i}>
              <NameBox className={style.nameBoxInCP}
                name={property.name}
                updateFunc={nameUpdate}
                onMouseDown={createChangeIndexFunc(i)}/>
              <button className={style.closeCPButton}onClick={createCloseFunc(i)}>×</button>
            </div>
          )
        })}
      </div>
      <div className={style.inputContainer}>
        <button onClick={addInput}>Add</button>
        {props.properties[index].inputs.map((input)=>{
          i++;
          return <input className={style.ioElm}type='text' defaultValue={i} key={i}/>
        })}
      </div>
      <div className={style.inputContainer}>
        <button onClick={addOutput}>Add</button>
        {props.properties[index].outputs.map((output)=>{
          i++;
          return <input className={style.ioElm}type='text' defaultValue={i} key={i}/>
        })}
      </div>
    </div>
  )
}

export default ControlPanel;
