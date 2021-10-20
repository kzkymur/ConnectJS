import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { Sockets } from '@/store/main/node';
import IO, { Handler as IOHandler } from './IO';
import Vector from '@/utils/vector';
import { useIdRef } from '@/utils/customHooks';
import style from '@/style/Node/IOs.scss';

export type Handler = {
  getJointPos: (isInput: boolean, key: string) => Vector;
  getAllJointPos: (isInput: boolean) => Vector[];
}
type Props = {
  id: number,
  inputs: Sockets;
  outputs: Sockets;
  operateNewConnection: (isInput: boolean, key: string) => () => void;
  registerNewConnection: (isInput: boolean, key: string) => () => void;
}

export type Socket = {
  id: number;
  name: keyof Sockets;
}; 
type SocketList = Socket[];
const toSocketList = (sockets: Sockets): SocketList => {
  const socketList: SocketList = [];
  const keys = Object.keys(sockets);
  keys.sort();
  keys.forEach((key, i) => socketList.push({ name: key, id: i, }));
  return socketList;
}

const IOs = forwardRef<Handler, Props>((props, fRef) => {
  const inputList = useMemo<SocketList>(() => toSocketList(props.inputs), []);
  const outputList = useMemo<SocketList>(() => toSocketList(props.outputs), []);
  const inputs = useIdRef<IOHandler, Socket>(inputList);
  const outputs = useIdRef<IOHandler, Socket>(outputList);

  const getJointPos = (isInput: boolean, key: string) => {
    const socket = (isInput ? inputs : outputs).find(s => s.name === key);
    if (socket === undefined) throw new Error(`invalid key = ${key}`);
    return socket.ref.current.getPos();
  }
  const getAllJointPos = (isInput: boolean) => {
    const sockets = isInput ? inputs : outputs;
    const jps: Vector[] = [];
    sockets.forEach(s=>{jps.push(s.ref.current.getPos())});
    return jps;
  }
  useImperativeHandle(fRef, ()=>({
    getJointPos,
    getAllJointPos,
  }));

  return (
    <div className={style.container}>
      <div className={style.package}>
        {inputs.map(s=>{
          const inputProps = {
            socket: s, isInput: true,
            operateNewConnection: props.operateNewConnection(true, s.name),
            registerNewConnection: props.registerNewConnection(true, s.name),
          }
          return <IO {...inputProps} ref={s.ref} key={s.id}/>
        })}
      </div>
      <div className={style.package}>
        {outputs.map(s=>{
          const outputProps = {
            socket: s,
            isInput: false,
            operateNewConnection: props.operateNewConnection(false, s.name),
            registerNewConnection: props.registerNewConnection(false, s.name),
          }
          return <IO {...outputProps} ref={s.ref} key={s.id}/>
        })}
      </div>
    </div>
  )
})

export default IOs;
