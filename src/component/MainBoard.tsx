import React, { useMemo, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@/store';
import { Node as NodeType, } from '@/store/main/node';
import { ConnectionType, NewConnectionInfo, } from '@/store/main/types';
import Node from './Node';
import Connection, { Handler as ConnectionHandler } from './Connection';
import { IdRef, useIdRef } from '@/utils/customHooks';
import style from '@/style/MainBoard.css'; 

const MemorizedNode = React.memo(Node);
const MemorizedConnection = React.memo(Connection);

const MainBoard: React.FC = () => {
  const { nodes, connections, curving } = useSelector((state: RootState) => state.mainReducer, shallowEqual);
  const cons = useIdRef<ConnectionHandler, ConnectionType>(connections);
  const [inputConnectionsArray, outputConnectionsArray] = useConnectionsArg(nodes, cons);
  const newConRef = useRef<ConnectionHandler>({} as ConnectionHandler);
  const newConInfoRef = useRef<NewConnectionInfo>({} as NewConnectionInfo);

  return (
    <div className={style.mainBoard}>
      {nodes.map((node, i) =>
        <MemorizedNode key={node.id}
          node={node}
          inputConnections={inputConnectionsArray[i]}
          outputConnections={outputConnectionsArray[i]}
          newConnectionInfoRef={newConInfoRef}
          newConnectionRef={newConRef}
        />
      )}
      <svg className={style.connectionPanel}>
        {cons.map(c =>
          <MemorizedConnection key={c.id} {...c}
            curving={curving}
        />)}
        <MemorizedConnection
          ref={newConRef}
          type={1}
          curving={curving}
          s={{x:0,y:0}}
          e={{x:0,y:0}}
        />
      </svg>
    </div>
  )
}

export default MainBoard;

const useConnectionsArg = (nodes: NodeType[], connectionInfos: ConnectionInfo[]) => {
  const inputConnectionsArray = useMemo(
    () => nodes.map(node => connectionInfos.filter(c => c.to.id === node.id)),
    [connectionInfos, nodes]
  );
  const outputConnectionsArray = useMemo(
    () => nodes.map(node => connectionInfos.filter(c => c.fromNodeId === node.id)),
    [connectionInfos, nodes]
  );
  return [inputConnectionsArray, outputConnectionsArray];
}

export type ConnectionInfo = IdRef<ConnectionHandler, ConnectionType>;
