import React, { useState, useEffect } from 'react'; import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/node/actions';
import { openCPAction } from '@/store/panel/actions';
import { Content, ConnectionType } from '@/store/node/types';
import Base, { Handler as BaseHandler } from './Base';
import ControllPanel from './ControllPanel';
import Connection, { Handler as ConnectionHandler } from './Connection';
import { updateIdRefs, IdRef } from '@/utils/manageIdRef';
import style from '@/style/MainBoard.css';

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.nodeReducer);
  const cpIdsList = useSelector((state: RootState) => state.panelReducer.cpIdsList);
  const connections = useSelector((state: RootState) => state.nodeReducer.connections);
  const [baseIdRefs, setBaseIdRefs] = useState<BaseIdRef[]>([]);
  useEffect(()=>{
    updateIdRefs<BaseHandler>(baseIdRefs, props.contents, setBaseIdRefs);
  }, [props.contents]);
  const [connectionIdRefs, setConnectionIdRefs] = useState<ConnectionIdRef[]>([]);
  useEffect(()=>{
    updateIdRefs<ConnectionHandler>(connectionIdRefs, props.connections, setConnectionIdRefs);
  }, [props.connections]);
  const [cpIndexes, setCPIndexes] = useState<number[]>([]);

  const dispatch = useDispatch();
  const openCPFunc = (id: number) => dispatch(openCPAction(id));
  const addConnection = (c: ConnectionType) => dispatch(addConnectionAction(c));

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

  useEffect(()=>{
    for (const i in cpIdsList) {
      if (cpIndexes[i] === undefined) {
        return setCPIndexes([...cpIndexes, 0]);
      }
    }
  }, [cpIdsList]);

  return (
    <div className={style.mainBoard}>
      {baseIdRefs.map((baseIdRef: BaseIdRef)=>{
        const c = props.contents.filter(c=>c.id === baseIdRef.id)[0];
        if (c===undefined) return null;
        const baseProps = {
          property: c, 
          openCP: createOpenCP(c.id),
        }
        return <Base key={c.id}{...baseProps} ref={baseIdRef.ref}/>
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
        {connections.map((c, i)=>{
          const cProps = { type: c.type, curving: props.curving, s: c.s, e: c.e, };
          return <Connection key={i} {...cProps}/>;
        })}
      </svg>
    </div>
  )
}

export default MainBoard;

type BaseIdRef = IdRef<BaseHandler>;
type ConnectionIdRef = IdRef<ConnectionHandler>;
