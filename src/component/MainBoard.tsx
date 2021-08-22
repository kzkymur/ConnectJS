import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConnectionAction } from '@/store/main/actions';
import { Node as NodeType, DataType, } from '@/store/main/node';
import { ConnectionType, } from '@/store/main/types';
import Node, { Handler as NodeHandler, Props as NodeProps } from './Node';
import nodeProps, { NewConnectionInfo } from './Node/props';
import Connection, { Handler as ConnectionHandler } from './Connection';
import { IdRef, useIdRef, usePropsFactory } from '@/utils/customHooks';
import Vector from '@/utils/vector';
import style from '@/style/MainBoard.css'; 
import {Obj} from '@/utils';

const MemorizedNode = React.memo(Node);
const MemorizedConnection = React.memo(Connection);

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.mainReducer);
  const cons = useIdRef<ConnectionHandler, ConnectionType>(props.connections);
  const newConRef = useRef<ConnectionHandler>({} as ConnectionHandler);
  const newConInfoRef = useRef<NewConnectionInfo>({});
  const dispatch = useDispatch();
  const addConnection = (c: ConnectionType) => dispatch(addConnectionAction(c));

  const nodePropsFactory = useCallback(
    (node: IdRef<NodeHandler, NodeType>) => nodeProps(node, cons.filter(c=>c.iNodeId===node.id), cons.filter(c=>c.oNodeId===node.id), newConRef, newConInfoRef, addConnection, dispatch),
    [cons, newConRef, newConInfoRef, addConnection, dispatch]);
  const perfectNodes = useNode(props.nodes, nodePropsFactory);

  return (
    <div className={style.mainBoard}>
      {perfectNodes.map(pn => <MemorizedNode key={pn.id} ref={pn.ref} {...pn.props}/>)}
      <svg className={style.connectionPanel}>
        {cons.map(c=><Connection key={c.id} ref={c.ref} {...cProps(c.type, props.curving, c.s, c.e)}/>)}
        <MemorizedConnection ref={newConRef} {...cProps(1,props.curving,{x:0,y:0},{x:0,y:0})}/>
      </svg>
    </div>
  )
}

export default MainBoard;

const cProps = (type: DataType, curving: number, start: Vector, end: Vector) => ({ type, curving, s: start, e: end });

const useNode = (nodes: NodeType[], propsFactory: (node: IdRef<NodeHandler, NodeType>) => NodeProps & Obj) => {
  const [perfectNodes, setPerfectNodes] = useState<(IdRef<NodeHandler, NodeType> & { props: NodeProps })[]>([]);
  const idRef = useIdRef<NodeHandler, NodeType>(nodes);
  const props = usePropsFactory(idRef, propsFactory);

  useEffect(()=>{
    let newPerfectNodes = [...perfectNodes];
    let updateFlag = false;

    idRef.forEach(ir=>{
      const propsIndex = props.findIndex(p => p.id === ir.id);
      if (propsIndex !== -1 && !perfectNodes.some(pn => pn.id === ir.id)) {
        updateFlag = true;
        newPerfectNodes.push(Object.assign(ir, { props: props[propsIndex] }));
      }
    })

    perfectNodes.forEach(pn => {
      if (!idRef.some(ir => ir.id === pn.id) || !props.some(p => p.id === pn.id)) {
        updateFlag = true;
        newPerfectNodes = newPerfectNodes.filter(npn => npn.id !== pn.id);
      }
    })

    if (updateFlag) setPerfectNodes(newPerfectNodes);
  }, [idRef, props]);

  return perfectNodes;
}
