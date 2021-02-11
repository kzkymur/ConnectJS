import React from 'react';
import { InputInfo, OutputInfo } from '@/store/types';
import NameBox from '@/component/atom/NameBox';
import style from '@/style/Base/IOs/IO.scss';

type Props = {
  io: InputInfo | OutputInfo;
  startConnectionMoving: (e: React.MouseEvent<HTMLDivElement>) => void;
  addConnection: () => void;
  iONameUpdate: (name: string) => void;
  isOutput: boolean;
}

const IO: React.FC<Props> = props => {
  return (
    <div className={`${style.container} ${props.isOutput ? style.output : ''}`}>
      <div className={style.jointContainer} 
        onMouseDown={props.startConnectionMoving}
        onMouseUp={props.addConnection}>
        <div className={style.joint} />
      </div>
      <NameBox className={style.nameBox}
        name={props.io.name}
        updateFunc={props.iONameUpdate}/>
    </div>
  )
}

export default IO;
