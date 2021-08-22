import React, { forwardRef, useImperativeHandle } from 'react';
import { Socket } from '@/store/main/node';
import IO, { Handler as IOHandler } from './IO';
import { getIndex } from '@/utils';
import Vector from '@/utils/vector';
import { useIdRef } from '@/utils/customHooks';
import style from '@/style/Node/IOs.scss';

export type Handler = {
  getJointPos: (isInput: boolean, id: number) => Vector;
  getAllJointPos: (isInput: boolean) => Vector[];
}
type Props = {
  id: number,
  inputs: Socket[];
  outputs: Socket[];
  operateNewConnection: (isInput: boolean, id: number) => () => void;
  registerNewConnection: (isInput: boolean, id: number) => () => void;
}

const IOs = forwardRef<Handler, Props>((props, fRef) => {
  const inputs = useIdRef<IOHandler, Socket>(props.inputs);
  const outputs = useIdRef<IOHandler, Socket>(props.outputs);

  const getJointPos = (isInput: boolean, id: number) => {
    const sockets = isInput ? inputs : outputs;
    const i = getIndex(sockets, id);
    if (i!==-1) return sockets[i].ref.current.getPos();
    return { x:0, y:0 };
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
            socket: s,
            isInput: true,
            operateNewConnection: props.operateNewConnection(true, s.id),
            registerNewConnection: props.registerNewConnection(true, s.id),
          }
          return <IO {...inputProps} ref={s.ref} key={s.id}/>
        })}
      </div>
      <div className={style.package}>
        {outputs.map(s=>{
          const outputProps = {
            socket: s,
            isInput: false,
            operateNewConnection: props.operateNewConnection(false, s.id),
            registerNewConnection: props.registerNewConnection(false, s.id),
          }
          return <IO {...outputProps} ref={s.ref} key={s.id}/>
        })}
      </div>
    </div>
  )
})

export default IOs;
