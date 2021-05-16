import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/node/actions';
import { openCPAction } from '@/store/panel/actions';
import { Node as NodeType, ConnectionType, DataType, DataTypes } from '@/store/node/types';
import Node, { Handler as NodeHandler } from './Node';
import nodeProps, { NewConnectionInfo } from './Node/props';
import Panel from './Panel';
import Connection, { Handler as ConnectionHandler } from './Connection';
import useIdRef, { mergeSourceAndIdRefs } from '@/utils/useIdRef';
import Vector from '@/utils/vector';
import style from '@/style/MainBoard.css'; 

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.nodeReducer);
  const cpIdsList = useSelector((state: RootState) => state.panelReducer.cpIdsList);
  const nodeIdRefs = useIdRef<NodeHandler>(props.nodes);
  const nodes = mergeSourceAndIdRefs<NodeType, NodeHandler>(props.nodes, nodeIdRefs);
  const connectionIdRefs = useIdRef<ConnectionHandler>(props.connections);
  const cons = mergeSourceAndIdRefs<ConnectionType, ConnectionHandler>(props.connections, connectionIdRefs);
  const newConRef = useRef<ConnectionHandler>({} as ConnectionHandler);
  const newConInfoRef = useRef<NewConnectionInfo>({});
  const dispatch = useDispatch();
  const openCPFunc = (id: number) => dispatch(openCPAction(id));
  const addConnection = (c: ConnectionType) => dispatch(addConnectionAction(c));

  return (
    <div className={style.mainBoard}>
      {nodes.map(n=><Node key={n.id} ref={n.ref} {...nodeProps(n, cons.filter(c=>c.iNodeId==n.id), cons.filter(c=>c.oNodeId==n.id), openCPFunc, newConRef, newConInfoRef, addConnection, dispatch)}/>)}
      {cpIdsList.map((ids, i)=>{
        if(ids[0]===undefined) return;
        const nodes: NodeType[] = [];
        ids.forEach(id=>{ nodes.push(props.nodes.filter(c=>c.id===id)[0]); })
        return <Panel key={i} {...pProps(nodes)}/>
      })}
      <svg className={style.connectionPanel}>
        {cons.map(c=><Connection key={c.id} ref={c.ref} {...cProps(c.type, props.curving, c.s, c.e)}/>)}
        <Connection ref={newConRef} {...cProps(DataTypes.Framebuffer,props.curving,{x:0,y:0},{x:0,y:0})}/>
      </svg>
    </div>
  )
}

export default MainBoard;

const pProps = (nodes: NodeType[]) => ({ nodes });
const cProps = (type: DataType, curving: number, start: Vector, end: Vector) => ({ type, curving, s: start, e: end });
