import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Socket } from '@/store/node/types';
import NameBox from '@/component/atom/NameBox';
import Vector from '@/utils/vector';
import style from '@/style/Base/IOs/IO.scss';

type Props = {
  socket: Socket;
  socketNameUpdate: (name: string) => void;
  isInput: boolean;
  operateNewConnection: () => void;
}

const IO = forwardRef<Vector, Props>((props, fRef) => {
  const [ ref ] = useState<React.RefObject<HTMLDivElement>>(React.createRef<HTMLDivElement>());
  useImperativeHandle(fRef, ()=>{
    if (ref.current === null) return { x:0, y:0};
    const joint = ref.current;
    const jointRect = joint.getBoundingClientRect();
    return {
      x: jointRect.left + joint.offsetWidth / 2,
      y: jointRect.top + joint.offsetHeight / 2,
    };
  });

  return (
    <div className={`${style.container} ${!props.isInput ? style.output : ''}`}>
      <div className={style.jointContainer}>
        <div className={style.joint} ref={ref}
          onMouseDown={props.operateNewConnection}
        />
      </div>
      <NameBox className={style.nameBox}
        name={props.socket.name}
        updateFunc={props.socketNameUpdate}/>
    </div>
  )
});

export default IO;
