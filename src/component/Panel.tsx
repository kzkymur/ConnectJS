import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Node, DataType, DataTypes } from '@/store/node/types';
import { Modes } from '@/content/types';
import { updateAction, addSocketAction } from '@/store/node/actions';
import { closeCPAction, closeAllCPAction } from '@/store/panel/actions';
import NameBox from './atom/NameBox';
import style from '@/style/ControllPanel.css';

type Props = {
  nodes: Node[];
}

const Panel: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState<number>(0);
  const updateFunc = (n: Node) => dispatch(updateAction(n));

  const nameUpdate = (name: string) => {
    const newnodeStyle: Node = {
      ...props.nodes[index],
      name: name,
    };
    updateFunc(newnodeStyle);
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
  const node = props.nodes[index] ? props.nodes[index] : props.nodes[0];
  switch (node.mode) {
    case Modes.canvas: {
      defaultOutputType = DataTypes.Framebuffer;
      break;
    }
    default: {
      defaultOutputType = DataTypes.Number;
    }
  }
  const addInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(addSocketAction(node.id, true, defaultOutputType));
  }
  const addOutput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(addSocketAction(node.id, false, defaultOutputType));
  }

  return (
    <div className={style.controllPanel}>
      <div className={style.headerContainer}>
        {props.nodes.map((b,i)=>{
          return(
            <div className={`${style.cpTabContainer} ${i===index ? style.activeCPTabContainer : ''}`} key={b.id}>
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
        {node.inputs.map((input,i)=> <input className={style.ioElm}type='text' defaultValue={i} key={input.id}/> )}
      </div>
      <div className={style.inputContainer}>
        <button onClick={addOutput}>Add</button>
        {node.outputs.map((output,i)=> <input className={style.ioElm}type='text' defaultValue={i} key={output.id}/> )}
      </div>
    </div>
  )
}

export default Panel;
