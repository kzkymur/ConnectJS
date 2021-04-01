import React, { useState, useEffect, MutableRefObject } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/node/actions';
import { openCPAction } from '@/store/panel/actions';
import { BaseType, ConnectionType } from '@/store/node/types';
import Base, { Handler as BaseHandler } from './Base';
import ControllPanel from './ControllPanel';
import Connection, { Handler as ConnectionHandler } from './Connection';
import { add, subtract } from '@/utils/vector';
import useIdRef, { mergeSourceAndIdRefs } from '@/utils/useIdRef';
import style from '@/style/MainBoard.css';

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.nodeReducer);
  const cpIdsList = useSelector((state: RootState) => state.panelReducer.cpIdsList);
  const baseIdRefs = useIdRef<BaseHandler>(props.bases);
  const bases = mergeSourceAndIdRefs<BaseType, BaseHandler>(props.bases, baseIdRefs);
  const connectionIdRefs = useIdRef<ConnectionHandler>(props.connections);
  const connections = mergeSourceAndIdRefs<ConnectionType, ConnectionHandler>(props.connections, connectionIdRefs);
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
        const ics: ConnectionInfo[] = [], ocs: ConnectionInfo[] = [];
        connections.forEach(c=>{ if (c.iBaseId==b.id) ics.push(c); if (c.oBaseId==b.id) ocs.push(c); });
        return <Base key={b.id} ref={b.ref} {...baseProps(b, createOpenCP(b.id), basePosChange(b, ics, ocs))}/>
      })}
      {cpIdsList.map((ids: number[], i)=>{
        if(ids[0]===undefined) return;
        let properties: BaseType[] = [];
        ids.forEach(id=>{ properties.push(props.bases.filter(c=>c.id===id)[0]); })
        return <ControllPanel key={i} {...cpProps(properties, cpIndexes[i], createSetCPIndex(i))}/>
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

type ConnectionInfo = ConnectionType & { ref: MutableRefObject<ConnectionHandler>; };

type BasePosChange = (
  base: BaseType & { ref: MutableRefObject<BaseHandler>; }, 
  inputConnections: ConnectionInfo[], 
  outputConnections: ConnectionInfo[]
) => (e: React.MouseEvent<HTMLDivElement>) => void;
const basePosChange: BasePosChange = (base, inputConnections, outputConnections) => (e) => {
  const pos = base.ref.current.getPos();
  const s = {x: e.clientX, y: e.clientY };
  const mousemove = (e: MouseEvent) => {
    const eClient = { x: e.clientX, y: e.clientY, };
    const diff = subtract(eClient, s);
    base.ref.current.updatePosStyle(add(diff, pos));
    inputConnections.forEach(ic=>{
      const { start, end } = ic.ref.current.getPos();
      ic.ref.current.changeView(start, add(end, diff));
    });
    outputConnections.forEach(oc=>{
      const { start, end } = oc.ref.current.getPos();
      oc.ref.current.changeView(add(start, diff), end);
    });
  }
  const mouseup = (e: MouseEvent) => {
    const eClient = { x: e.clientX, y: e.clientY, };
    const diff = subtract(eClient, s);
    base.ref.current.updatePosState(add(diff, pos));
    inputConnections.forEach(ic=>{
      const { start, end } = ic.ref.current.getPos();
      ic.ref.current.setPos(start, add(end, diff));
    });
    outputConnections.forEach(oc=>{
      const { start, end } = oc.ref.current.getPos();
      oc.ref.current.setPos(add(start, diff), end);
    });
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
  }
  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
}

const baseProps = (property: BaseType, openCP: ()=>void, posChange: (e: React.MouseEvent<HTMLDivElement>) => void) => ({ property, openCP, posChange, });
const cpProps = (properties: BaseType[], index: number, setIndex: (index: number)=>void) => ({ properties, index, setIndex, });
