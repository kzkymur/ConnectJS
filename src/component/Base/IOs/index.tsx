import React, { useState, useEffect } from 'react';
import { Socket } from '@/store/node/types';
import IO from './IO';
import { getIndex } from '@/utils';
import style from '@/style/Base/IOs.scss';

type Props = {
  id: number,
  inputs: Socket[];
  outputs: Socket[];
  createIONameUpdate: (isInput: boolean, index: number) => (name: string) => void;
}

type JointRefType = {
  id: number;
  ref: React.RefObject<HTMLDivElement>;
}

const IOs: React.FC<Props> = props => {
  const [inputJointRefs, setInputJointRefs] = useState<JointRefType[]>([]);
  const [outputJointRefs, setOutputJointRefs] = useState<JointRefType[]>([]);
  const addIJR = (id: number) => [...inputJointRefs, {id: id, ref: React.createRef<HTMLDivElement>()}];
  const addOJR = (id: number) => [...outputJointRefs, {id: id, ref: React.createRef<HTMLDivElement>()}];
  const removeIJR = (id: number) => inputJointRefs.filter(bmi=>bmi.id!==id);
  const removeOJR = (id: number) => outputJointRefs.filter(bmi=>bmi.id!==id);
  useEffect(()=>{
    let newInputJointRef = [...inputJointRefs];
    let flag = false;
    // props.inputs.forEach(input=>{
    //   const i = getIndex(newInputJointRef, input.id);
    //   if (i === -1) { flag = true; newInputJointRef = addIJR(input.id); }
    // });
    // newInputJointRef.forEach(ijr=>{
    //   const i = getIndex(props.inpus, ijr.id);
    //   if (i === -1) { flag = true; newInputJointRef = removeIJR(ijr.id); }
    // });
    for (let i=inputJointRefs.length; i<props.inputs.length; i++) {
      newInputJointRef = addIJR(i);
      flag = true;
    }
    if (flag) setInputJointRefs(newInputJointRef);
  }, [props.inputs]);
  useEffect(()=>{
    let newOutputJointRef= [...outputJointRefs];
    let flag = false;
    // props.outputs.forEach(output=>{
    //   const i = getIndex(newOutputJointRef, output.id);
    //   if (i === -1) { flag = true; newOutputJointRef = addOJR(output.id); }
    // });
    // newOutputJointRef.forEach((ojr, i)=>{
      // const i = getIndex(props.outpus, ojr.id);
      // if (i === -1) { flag = true; newOutputJointRef = removeOJR(ijr.id); }
      // if (i === -1) { flag = true; newOutputJointRef = removeOJR(i); }
    //   if (flag) setOutputJointRefs(newOutputJointRef);
    // });
  }, [props.outputs]);

  return (
    <div className={style.container}>
      <div className={style.package}>
        {inputJointRefs.map((jointRef, i)=>{
          const input = props.inputs[jointRef.id];
          const inputProps = {
            io: input,
            iONameUpdate: props.createIONameUpdate(true, i),
            isOutput: false,
            fRef: jointRef.ref,
          }
          return <IO {...inputProps} key={i}/>
        })}
      </div>
      <div className={style.package}>
        {outputJointRefs.map((jointRef, i)=>{
          const output = props.outputs[jointRef.id];
          const outputProps = {
            io: output,
            iONameUpdate: props.createIONameUpdate(false, i),
            isOutput: true,
            fRef: jointRef.ref,
          }
          return <IO {...outputProps} key={i}/>
        })}
      </div>
    </div>
  )
}

export default IOs;
