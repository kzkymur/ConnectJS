import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BaseType, NodeModeNames, DataTypes, DataType } from '@/store/node/types';
import { updateAction, addSocketAction } from '@/store/node/actions';
import { closeCPAction, closeAllCPAction } from '@/store/panel/actions';
import NameBox from './atom/NameBox';
import style from '@/style/ControllPanel.css';

type Props = {
  bases: BaseType[];
}

const Panel: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState<number>(0);
  const updateFunc = (c: BaseType) => dispatch(updateAction(c));

  const nameUpdate = (name: string) => {
    const newBaseStyle: BaseType = {
      ...props.bases[index],
      name: name,
    };
    updateFunc(newBaseStyle);
  }
  const closeAllFunc = () => dispatch(closeAllCPAction());
  const createChangeIndexFunc = (newIndex: number) => {
    const changeIndexFunc = (e: React.MouseEvent<HTMLInputElement>) => {
      if (index!==newIndex) {
        e.preventDefault();
        setIndex(newIndex);
      }
    }
    return changeIndexFunc;
  }
  const createCloseFunc = (closeIndex: number) => {
    const closeFunc = () => {
      dispatch(closeCPAction(closeIndex));
      if (closeIndex===index) {
        setIndex(0);
      } else if (closeIndex < index) {
        setIndex(index-1);
      }
    }
    return closeFunc;
  }

  let defaultOutputType: DataType;
  // switch (props.bases[index].mode.name) {
  switch (props.bases[index] ? props.bases[index].mode.name : props.bases[0].mode.name) {
    case NodeModeNames.Canvas: {
      defaultOutputType = DataTypes.Framebuffer;
      break;
    }
    default: {
      defaultOutputType = DataTypes.Number;
    }
  }
  const addInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(addSocketAction(props.bases[index].id, true, defaultOutputType));
  }
  const addOutput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(addSocketAction(props.bases[index].id, false, defaultOutputType));
  }

  let i = -1;
  return (
    <div className={style.controllPanel}>
      <div className={style.headerContainer}>
        {props.bases.map(b=>{
          i++;
          return(
            <div className={`${style.cpTabContainer} ${i===index ? style.activeCPTabContainer : ''}`} key={i}>
              <NameBox className={style.nameBoxInCP}
                name={b.name}
                updateFunc={nameUpdate}
                onMouseDown={createChangeIndexFunc(i)}/>
              <button className={style.closeCPButton}onClick={createCloseFunc(i)}>×</button>
            </div>
          )
        })}
      </div>
      <div className={style.inputContainer}>
        <button onClick={addInput}>Add</button>
        {props.bases[index].inputs.map((input)=>{
          i++;
          return <input className={style.ioElm}type='text' defaultValue={i} key={i}/>
        })}
      </div>
      <div className={style.inputContainer}>
        <button onClick={addOutput}>Add</button>
        {props.bases[index].outputs.map((output)=>{
          i++;
          return <input className={style.ioElm}type='text' defaultValue={i} key={i}/>
        })}
      </div>
    </div>
  )
}

export default Panel;
