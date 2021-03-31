import React, { useState, useEffect, useRef, MutableRefObject, forwardRef, useImperativeHandle } from 'react';
import { Socket } from '@/store/node/types';
import IO from './IO';
import { Vector, getIndex } from '@/utils';
import { IdRef, updateIdRefs } from '@/utils/manageIdRef';
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
  const [inputJointRefs, setInputJointRefs] = useState<JointRef[]>([]);
  useEffect(()=>{ 
    updateIdRefs<Vector>(inputJointRefs, props.inputs, setInputJointRefs); 
  }, [props.inputs]);
  const [outputJointRefs, setOutputJointRefs] = useState<JointRef[]>([]);
  useEffect(()=>{ 
    updateIdRefs<Vector>(outputJointRefs, props.outputs, setOutputJointRefs); 
  }, [props.outputs]);

  const getJointPos = (isInput: boolean, id: number) => {
    const sockets = isInput ? inputJointRefs : inputJointRefs;
    const i = getIndex(sockets, id);
    if (i!==-1) return sockets[i].ref.current;
    return { x:0, y:0 };
  }
  const getAllJointPos = (isInput: boolean) => {
    const sockets = isInput ? inputJointRefs : inputJointRefs;
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
        {inputJointRefs.map((jointRef, i)=>{
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
        {outputJointRefs.map((jointRef, i)=>{
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

type JointRef = IdRef<Vector>;
