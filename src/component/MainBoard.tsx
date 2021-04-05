import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/node/actions';
import { openCPAction } from '@/store/panel/actions';
import { BaseType, ConnectionType, DataType } from '@/store/node/types';
import Base, { Handler as BaseHandler } from './Base';
import baseProps from './Base/props';
import Panel from './Panel';
import Connection, { Handler as ConnectionHandler } from './Connection';
import useIdRef, { mergeSourceAndIdRefs } from '@/utils/useIdRef';
import style from '@/style/MainBoard.css'; 
import Vector from '@/utils/vector';

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.nodeReducer);
  const cpIdsList = useSelector((state: RootState) => state.panelReducer.cpIdsList);
  const baseIdRefs = useIdRef<BaseHandler>(props.bases);
  const bases = mergeSourceAndIdRefs<BaseType, BaseHandler>(props.bases, baseIdRefs);
  const connectionIdRefs = useIdRef<ConnectionHandler>(props.connections);
  const cons = mergeSourceAndIdRefs<ConnectionType, ConnectionHandler>(props.connections, connectionIdRefs);
  const [cpIndexes, setCPIndexes] = useState<number[]>([]);
  const dispatch = useDispatch();
  const openCPFunc = (id: number) => dispatch(openCPAction(id));
  const addConnection = (c: ConnectionType) => dispatch(addConnectionAction(c));

  // controlPanel系
  const createSetCPIndex = (cpIndex: number) => {
    const setCPIndex = (newIndex: number) => {
      setCPIndexes( cpIndexes.map( (oldIndex, i) => i === cpIndex ? newIndex : oldIndex ))
    }
    return setCPIndex
  }

  useEffect(()=>{
    for (const i in cpIdsList) {
      if (cpIndexes[i] === undefined) {
        return setCPIndexes([...cpIndexes, 0]);
      }
    }
  }, [cpIdsList]);

  return (
    <div className={style.mainBoard}>
      {bases.map(b=>{
        return <Base key={b.id} ref={b.ref} {...baseProps( b, cons.filter(c=>c.iBaseId==b.id), cons.filter(c=>c.oBaseId==b.id), openCPFunc)}/>
      })}
      {cpIdsList.map((ids: number[], i)=>{
        if(ids[0]===undefined) return;
        let properties: BaseType[] = [];
        ids.forEach(id=>{ properties.push(props.bases.filter(c=>c.id===id)[0]); })
        return <Panel key={i} {...cpProps(properties, cpIndexes[i], createSetCPIndex(i))}/>
      })}
      <svg className={style.connectionPanel}>
        {cons.map((c, i)=> <Connection key={i} {...cProps(c.type, props.curving, c.s, c.e)}/> )}
      </svg>
    </div>
  )
}

export default MainBoard;

const cpProps = (properties: BaseType[], index: number, setIndex: (index: number)=>void) => ({ properties, index, setIndex, });
const cProps = (type: DataType, curving: number, start: Vector, end: Vector) => ({ type, curving, s: start, e: end });
