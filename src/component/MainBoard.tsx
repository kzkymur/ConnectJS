import React, { useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/node/actions';
import { openCPAction } from '@/store/panel/actions';
import { Content, Connection as ConnectionType } from '@/store/node/types';
import Base from './Base';
import ControllPanel from './ControllPanel';
import Connection from './Connection';
import { getIndex } from '@/utils';
import style from '@/style/MainBoard.css';

type BaseIdRefType = {
  id: number;
  ref: React.RefObject<HTMLDivElement>;
}

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.nodeReducer);
  const cpIdsList = useSelector((state: RootState) => state.panelReducer.cpIdsList);
  const [baseIdRefs, setBaseIdRefs] = useState<BaseIdRefType[]>([]);
  const [cpIndexes, setCPIndexes] = useState<number[]>([]);

  const dispatch = useDispatch();
  const openCPFunc = (id: number) => dispatch(openCPAction(id));
  const addConnection = (c: ConnectionType) => dispatch(addConnectionAction(c));

  // refのsetup
  const addBIR = (id: number) => [...baseIdRefs, {id: id, ref: React.createRef<HTMLDivElement>()}];
  const removeBIR = (id: number) => baseIdRefs.filter(bmi=>bmi.id!==id);

  // controlPanel系
  const createOpenCP = (id: number) => {
    const openCP = () => {
      const currentIndex = cpIdsList[0].indexOf(id);
      if (currentIndex === -1) {
        openCPFunc(id);
        createSetCPIndex(0)(cpIdsList[0].length);
      } else if (currentIndex !== cpIndexes[0]){
        createSetCPIndex(0)(currentIndex);
      }
    }
    return openCP;
  }
  const createSetCPIndex = (cpIndex: number) => {
    const setCPIndex = (newIndex: number) => {setCPIndexes( cpIndexes.map( (oldIndex, i) => i === cpIndex ? newIndex : oldIndex ))}
    return setCPIndex
  }

  // 状態確認系
  useEffect(()=>{
    let newBaseIdRefs = [...baseIdRefs];
    let flag = false;
    props.contents.forEach(c=>{
      const i = getIndex(newBaseIdRefs, c.id);
      if (i === -1) { flag = true; newBaseIdRefs = addBIR(c.id); }
    });
    newBaseIdRefs.forEach(bir=>{
      const i = getIndex(props.contents, bir.id);
      if (i === -1) { flag = true; newBaseIdRefs = removeBIR(bir.id); }
    });
    if (flag) setBaseIdRefs(newBaseIdRefs);
  }, [props.contents]);
  useEffect(()=>{
    for (const i in cpIdsList) {
      if (cpIndexes[i] === undefined) {
        return setCPIndexes([...cpIndexes, 0]);
      }
    }
  }, [cpIdsList]);

  return (
    <div className={style.mainBoard}>
      {baseIdRefs.map((baseIdRef: BaseIdRefType)=>{
        const c = props.contents.filter(c=>c.id === baseIdRef.id)[0];
        if (c===undefined) return null;
        const baseProps = {
          property: c, 
          openCP: createOpenCP(c.id),
        }
        return <Base key={c.id}{...baseProps}/>
      })}
      {cpIdsList.map((ids: number[], i)=>{
        if(ids[0]===undefined) return;
        let properties: Content[] = [];
        ids.forEach(id=>{
          let c = props.contents.filter(c=>c.id===id)[0];
          properties.push(c);
        })
        const cpProps = { 
          properties: properties, 
          index: cpIndexes[i],
          setIndex: createSetCPIndex(i),
        }
        return <ControllPanel {...cpProps} key={i}/>
      })}
      <svg className={style.connectionPanel}>
      </svg>
    </div>
  )
}

export default MainBoard;
