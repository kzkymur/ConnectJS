import React, { useEffect, useRef, RefObject, MutableRefObject, } from 'react';
import { Node as NodeType, Socket, isMovable, isResizable, } from '@/store/main/node';
import Header from './Header';
import Main from './Main';
import IOs, { Handler as IOsHandler } from './IOs';
import { Handler as ConnectionHandler } from '../Connection';
import useFunctions from './cutomHooks';
import Content from '@/content';
import { px, px2n } from '@/utils';
import { optBarHeight, borderWidth, } from '@/config';
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

  useEffect(()=>{
    const elm = ref.current;
    elm.style.opacity = '1';
  })

  if (isMovable(property)) useEffect(()=>{
    const elm = ref.current;
    const { top, left } = property;
    elm.style.top = top;
    elm.style.left = left;
  }, [property.top, property.left]);

  if (isResizable(property)) useEffect(()=>{
    const elm = ref.current;
    const { width, height } = property;
    elm.style.width = px(px2n(width)-borderWidth*2);
    mainRef.current.style.height = px(px2n(height) - borderWidth * 2);
    ref.current.style.height = px(px2n(height) + optBarHeight * (Math.max(property.inputs.length, property.outputs.length)+1) - borderWidth * 2);
  }, [property.width, property.height]);

  const { onMouseDown, onMouseMove, deleteFunc, operateNewConnection, registerNewConnection } = useFunctions(property, inputConnections, outputConnections, ref, mainRef, iosRef, newConnectionRef, newConnectionInfoRef);

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

export const calcMainHeight = (height: number, inputs: Array<Socket>, outputs: Array<Socket>): number => (height - optBarHeight * (Math.max(inputs.length, outputs.length)+1));

const headerProps = (id: number, name: string, deleteFunc: ()=>void) => ({ id, name, deleteFunc, });
const mainProps = (fRef: RefObject<HTMLDivElement>) => ({ fRef });
const IOsProps = (id: number, inputs: Socket[], outputs: Socket[], operateNewConnection: (isInput: boolean ,id: number) => () => void, registerNewConnection: (isInput: boolean ,id: number) => () => void) => ({ id, inputs, outputs, operateNewConnection, registerNewConnection });
