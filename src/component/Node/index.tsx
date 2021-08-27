import React, { useRef, RefObject, MutableRefObject, } from 'react';
import { Node as NodeType, Socket, isResizable, } from '@/store/main/node';
import Header from './Header';
import Main from './Main';
import IOs, { Handler as IOsHandler } from './IOs';
import { Handler as ConnectionHandler } from '../Connection';
import { useFunctions, useStyleEffect, } from './cutomHooks';
import Content from '@/content';
import { NewConnectionInfo, ConnectionInfo } from '@/component/MainBoard';
import style from '@/style/Node.scss';

export type Props = {
  node: NodeType;
  inputConnections: ConnectionInfo[];
  outputConnections: ConnectionInfo[];
  newConnectionRef: MutableRefObject<ConnectionHandler>,
  newConnectionInfoRef: MutableRefObject<NewConnectionInfo>,
}

const Node: React.FC<Props> = props => {
  const ref = useRef<HTMLDivElement>({} as HTMLDivElement);
  const iosRef = useRef({} as IOsHandler);
  const mainRef = useRef<HTMLDivElement>({} as HTMLDivElement);

  const {
    onMouseDown,
    onMouseMove,
    deleteFunc,
    operateNewConnection,
    registerNewConnection
  } = useFunctions(props.node, props.inputConnections, props.outputConnections, ref, mainRef, iosRef, props.newConnectionRef, props.newConnectionInfoRef);
  useStyleEffect(props.node, ref, mainRef);

  return (
    <div className={`${style.container} ${isResizable(props.node) ? style.resizable : ''}`}
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      <Header {...headerProps(props.node.id, props.node.name, deleteFunc)}/>
      <Main {...mainProps(mainRef)}>
        <Content mode={props.node.mode}/>
      </Main>
      <IOs {...IOsProps(props.node.id, props.node.inputs, props.node.outputs, operateNewConnection, registerNewConnection)} ref={iosRef}/>
    </div>
  );
};

export default Node;

const headerProps = (id: number, name: string, deleteFunc: ()=>void) => ({ id, name, deleteFunc, });
const mainProps = (fRef: RefObject<HTMLDivElement>) => ({ fRef });
const IOsProps = (id: number, inputs: Socket[], outputs: Socket[], operateNewConnection: (isInput: boolean ,id: number) => () => void, registerNewConnection: (isInput: boolean ,id: number) => () => void) => ({ id, inputs, outputs, operateNewConnection, registerNewConnection });
