import React, { forwardRef, useImperativeHandle } from 'react';
import { Socket } from '@/store/node/types';
import IO from './IO';
import { getIndex } from '@/utils';
import Vector from '@/utils/vector';
import useIdRef, { mergeSourceAndIdRefs } from '@/utils/useIdRef';
import style from '@/style/Base/IOs.scss';

export type Handler = {
  getJointPos: (isInput: boolean, id: number) => Vector;
  getAllJointPos: (isInput: boolean) => Vector[];
}
type Props = {
  id: number,
  inputs: Socket[];
  outputs: Socket[];
  createIONameUpdate: (isInput: boolean, index: number) => (name: string) => void;
}

const IOs = forwardRef<Handler, Props>((props, fRef) => {
  const inputIdRefs = useIdRef<Vector>(props.inputs);
  const inputs = mergeSourceAndIdRefs<Socket, Vector>(props.inputs, inputIdRefs);
  const outputIdRefs = useIdRef<Vector>(props.outputs);
  const outputs = mergeSourceAndIdRefs<Socket, Vector>(props.outputs, outputIdRefs);

  const getJointPos = (isInput: boolean, id: number) => {
    const sockets = isInput ? inputs : outputs;
    const i = getIndex(sockets, id);
    if (i!==-1) return sockets[i].ref.current;
    return { x:0, y:0 };
  }
  const getAllJointPos = (isInput: boolean) => {
    const sockets = isInput ? inputs : outputs;
    const jps: Vector[] = [];
    sockets.forEach(s=>{jps.push(s.ref.current)});
    return jps;
  }
  useImperativeHandle(fRef, ()=>({
    getJointPos,
    getAllJointPos,
  }));

  return (
    <div className={style.container}>
      <div className={style.package}>
        {inputs.map((jointRef, i)=>{
          const input = props.inputs[jointRef.id];
          const inputProps = {
            io: input,
            iONameUpdate: props.createIONameUpdate(true, i),
            isOutput: false,
          }
          return <IO {...inputProps} ref={jointRef.ref} key={i}/>
        })}
      </div>
      <div className={style.package}>
        {outputs.map((jointRef, i)=>{
          const output = props.outputs[jointRef.id];
          const outputProps = {
            io: output,
            iONameUpdate: props.createIONameUpdate(false, i),
            isOutput: true,
          }
          return <IO {...outputProps} ref={jointRef.ref} key={i}/>
        })}
      </div>
    </div>
  )
})

export default IOs;
