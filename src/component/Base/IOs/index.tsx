import React from 'react';
import { InputInfo, OutputInfo } from '@/store/node/types';
import IO from './IO';
import style from '@/style/Base/IOs.scss';

type Props = {
  id: number,
  inputs: InputInfo[];
  outputs: OutputInfo[];
  createStartConnectionMoving: (id: number, isInput: boolean, channel: number, isConnected: boolean) => (e: React.MouseEvent<HTMLDivElement>) => void;
  createAddConnection: (id: number, isInput: boolean, channel: number) => () => void;
  createIONameUpdate: (isInput: boolean, index: number) => (name: string) => void;
}

const IOs: React.FC<Props> = props => {
  return (
    <div className={style.container}>
      <div className={style.package}>
        {props.inputs.map((input, i)=>{
          const inputProps = {
            io: input,
            startConnectionMoving: props.createStartConnectionMoving(props.id, true, i, input.oBaseId!==undefined),
            addConnection: props.createAddConnection(props.id, true, i),
            iONameUpdate: props.createIONameUpdate(true, i),
            isOutput: false,
          }
          return <IO {...inputProps} key={i}/>
        })}
      </div>
      <div className={style.package}>
        {props.outputs.map((output, i)=>{
          const outputProps = {
            io: output,
            startConnectionMoving: props.createStartConnectionMoving(props.id, false, i, output.isConnected),
            addConnection: props.createAddConnection(props.id, false, i),
            iONameUpdate: props.createIONameUpdate(false, i),
            isOutput: true,
          }
          return <IO {...outputProps} key={i}/>
        })}
      </div>
    </div>
  )
}

export default IOs;
