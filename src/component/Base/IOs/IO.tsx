import React, { forwardRef, useImperativeHandle } from 'react';
import { Socket } from '@/store/node/types';
import NameBox from '@/component/atom/NameBox';
import style from '@/style/Base/IOs/IO.scss';

type Props = {
  io: Socket;
  iONameUpdate: (name: string) => void;
  isOutput: boolean;
  fRef: React.RefObject<HTMLDivElement>;
}

type Handler = {
  posX: number;
  posY: number;
}

const IO = forwardRef<Handler, Props>((props, ref) => {
  useImperativeHandle(ref, ()=>{
    if (props.fRef.current === null) return { posX:0,posY:0};
    const joint = props.fRef.current;
    const jointRect = joint.getBoundingClientRect();
    return {
      posX: jointRect.left + joint.offsetWidth / 2,
      posY: jointRect.top + joint.offsetHeight / 2,
    };
  });

  return (
    <div className={`${style.container} ${props.isOutput ? style.output : ''}`}>
      <div className={style.jointContainer}>
        <div className={style.joint} ref={props.fRef}/>
      </div>
      <NameBox className={style.nameBox}
        name={props.io.name}
        updateFunc={props.iONameUpdate}/>
    </div>
  )
});

export default IO;
