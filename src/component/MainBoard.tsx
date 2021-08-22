import React, { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/main/actions';
import { openCPAction } from '@/store/panel/actions';
import { Node as NodeType, DataType, } from '@/store/main/node';
import { ConnectionType, } from '@/store/main/types';
import Node, { Handler as NodeHandler } from './Node';
import nodeProps, { NewConnectionInfo } from './Node/props';
import Panel from './Panel';
import Connection, { Handler as ConnectionHandler } from './Connection';
import { IdRef, useIdRef, usePropsFactory } from '@/utils/customHooks';
import Vector from '@/utils/vector';
import style from '@/style/MainBoard.css'; 

const MemorizedNode = React.memo(Node);
const MemorizedConnection = React.memo(Connection);

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.mainReducer);
  const cpIdsList = useSelector((state: RootState) => state.panelReducer.cpIdsList);
  const nodes = useIdRef<NodeHandler, NodeType>(props.nodes);
  const cons = useIdRef<ConnectionHandler, ConnectionType>(props.connections);
  const newConRef = useRef<ConnectionHandler>({} as ConnectionHandler);
  const newConInfoRef = useRef<NewConnectionInfo>({});
  const dispatch = useDispatch();
  const openCPFunc = (id: number) => dispatch(openCPAction(id));
  const addConnection = (c: ConnectionType) => dispatch(addConnectionAction(c));

  const nodePropsFactory = useCallback((node: IdRef<NodeHandler, NodeType>) => nodeProps(node, cons.filter(c=>c.iNodeId===node.id), cons.filter(c=>c.oNodeId===node.id), newConRef, newConInfoRef, addConnection, dispatch), [cons, newConRef, newConInfoRef, addConnection, dispatch]);
  const nodePropsArray = usePropsFactory(nodes, nodePropsFactory);

  return (
    <div className={style.mainBoard}>
      {nodePropsArray.map((n, i) => <MemorizedNode key={nodes[i].id} ref={nodes[i].ref} {...n}/>)}
      {cpIdsList.map((ids, i)=>{
        if(ids[0]===undefined) return;
        const nodes: NodeType[] = [];
        ids.forEach(id=>{ nodes.push(props.nodes.filter(c=>c.id===id)[0]); })
        return <Panel key={i} {...pProps(nodes)}/>
      })}
      <svg className={style.connectionPanel}>
        {cons.map(c=><Connection key={c.id} ref={c.ref} {...cProps(c.type, props.curving, c.s, c.e)}/>)}
        <MemorizedConnection ref={newConRef} {...cProps(1,props.curving,{x:0,y:0},{x:0,y:0})}/>
      </svg>
    </div>
  )
}

export default MainBoard;

const pProps = (nodes: NodeType[]) => ({ nodes });
const cProps = (type: DataType, curving: number, start: Vector, end: Vector) => ({ type, curving, s: start, e: end });
