import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/node/actions';
import { openCPAction } from '@/store/panel/actions';
import { BaseType, ConnectionType, DataType, DataTypes } from '@/store/node/types';
import Base, { Handler as BaseHandler } from './Base';
import baseProps, { NewConnectionInfo } from './Base/props';
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
  const newConRef = useRef<ConnectionHandler>({} as ConnectionHandler);
  const newConInfoRef = useRef<NewConnectionInfo>({});
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
      {bases.map(b=><Base key={b.id} ref={b.ref} {...baseProps(b, cons.filter(c=>c.iBaseId==b.id), cons.filter(c=>c.oBaseId==b.id), openCPFunc, newConRef, newConInfoRef, addConnection, dispatch)}/>)}
      {cpIdsList.map((ids: number[], i)=>{
        if(ids[0]===undefined) return;
        let bases: BaseType[] = [];
        ids.forEach(id=>{ bases.push(props.bases.filter(c=>c.id===id)[0]); })
        return <Panel key={i} {...pProps(bases, cpIndexes[i], createSetCPIndex(i))}/>
      })}
      <svg className={style.connectionPanel}>
        {cons.map(c=><Connection key={c.id} ref={c.ref} {...cProps(c.type, props.curving, c.s, c.e)}/>)}
        <Connection ref={newConRef} {...cProps(DataTypes.Framebuffer,props.curving,{x:0,y:0},{x:0,y:0})}/>
      </svg>
    </div>
  )
}

export default MainBoard;

const pProps = (bases: BaseType[], index: number, setIndex: (index: number)=>void) => ({ bases, index, setIndex, });
const cProps = (type: DataType, curving: number, start: Vector, end: Vector) => ({ type, curving, s: start, e: end });
