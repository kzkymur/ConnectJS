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
  property: NodeType;
  inputConnections: ConnectionInfo[];
  outputConnections: ConnectionInfo[];
  newConnectionRef: MutableRefObject<ConnectionHandler>,
  newConnectionInfoRef: MutableRefObject<NewConnectionInfo>,
}

const Node: React.FC<Props> = props => {
  const { property, inputConnections, outputConnections, newConnectionRef, newConnectionInfoRef } = props;
  const ref = useRef<HTMLDivElement>({} as HTMLDivElement);
  const iosRef = useRef({} as IOsHandler);
  const mainRef = useRef<HTMLDivElement>({} as HTMLDivElement);

  const { onMouseDown, onMouseMove, deleteFunc, operateNewConnection, registerNewConnection } = useFunctions(property, inputConnections, outputConnections, ref, mainRef, iosRef, newConnectionRef, newConnectionInfoRef);
  useStyleEffect(property, ref, mainRef);

  return (
    <div className={`${style.container} ${isResizable(property) ? style.resizable : ''}`} ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      <Header {...headerProps(property.id, property.name, deleteFunc)}/>
      <Main {...mainProps(mainRef)}>
        <Content mode={property.mode}/>
      </Main>
      <IOs {...IOsProps(property.id, property.inputs, property.outputs, operateNewConnection, registerNewConnection)} ref={iosRef}/>
    </div>
  );
};

export default Node;


const headerProps = (id: number, name: string, deleteFunc: ()=>void) => ({ id, name, deleteFunc, });
const mainProps = (fRef: RefObject<HTMLDivElement>) => ({ fRef });
const IOsProps = (id: number, inputs: Socket[], outputs: Socket[], operateNewConnection: (isInput: boolean ,id: number) => () => void, registerNewConnection: (isInput: boolean ,id: number) => () => void) => ({ id, inputs, outputs, operateNewConnection, registerNewConnection });
