import React, { useState, useEffect, useRef, MutableRefObject, forwardRef, useImperativeHandle } from 'react';
import { Socket } from '@/store/node/types';
import IO from './IO';
import { getIndex, Vector } from '@/utils';
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
  const [socketJointRefs, setSocketJointRefs] = useState<SocketJointRefs>({input: [], output: []});
  const addJR = (jrs: JointRefType[], id: number) => [...jrs, {id: id, ref: useRef({} as Vector)}];
  const removeJR = (jrs: JointRefType[], id: number) => jrs.filter(jr=>jr.id!==id);
  const updateSJR = (isInput: boolean) => {
    const sockets = isInput ? props.inputs : props.outputs;
    const key = isInput ? 'input' : 'output', newSJR = {...socketJointRefs};
    let newJointRefs = isInput ? [...socketJointRefs.input] : [...socketJointRefs.output];
    let flag = false;
    sockets.forEach(input=>{
      const i = getIndex(newJointRefs, input.id);
      if (i === -1) { flag = true; newJointRefs = addJR(newJointRefs, input.id); }
    });
    newJointRefs.forEach(jr=>{
      const i = getIndex(props.inputs, jr.id);
      if (i === -1) { flag = true; newJointRefs = removeJR(newJointRefs, jr.id); }
    });
    if (flag) {
      newSJR[key] = newJointRefs;
      setSocketJointRefs(newSJR);
    }
  }
  useEffect(()=>{ updateSJR(true); }, [props.inputs]);
  useEffect(()=>{ updateSJR(false); }, [props.outputs]);

  const getJointPos = (isInput: boolean, id: number) => {
    const sockets = isInput ? socketJointRefs.input : socketJointRefs.output;
    const i = getIndex(sockets, id);
    if (i!==-1) return sockets[i].ref.current;
    return { x:0, y:0 };
  }
  const getAllJointPos = (isInput: boolean) => {
    const sockets = isInput ? socketJointRefs.input : socketJointRefs.output;
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
        {socketJointRefs.input.map((jointRef, i)=>{
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
        {socketJointRefs.output.map((jointRef, i)=>{
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

type JointRefType = {
  id: number;
  ref: MutableRefObject<Vector>;
}
type SocketJointRefs = {
  input: JointRefType[];
  output: JointRefType[];
}
