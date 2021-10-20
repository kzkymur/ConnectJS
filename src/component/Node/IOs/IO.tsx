import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Vector from '@/utils/vector';
import style from '@/style/Node/IOs/IO.scss';
import { Socket } from '.';

export type Handler = {
  getPos: () => Vector;
}
type Props = {
  socket: Socket;
  isInput: boolean;
  operateNewConnection: () => void;
  registerNewConnection: () => void;
}

const IO = forwardRef<Handler, Props>((props, fRef) => {
  const ref = useRef<HTMLDivElement>({} as HTMLDivElement);
  const stopEventPropagation = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();
  const getPos = () => {
    if (ref.current === null) return { x:0, y:0};
    const joint = ref.current;
    const jointRect = joint.getBoundingClientRect();
    return {
      x: jointRect.left + joint.offsetWidth / 2,
      y: jointRect.top + joint.offsetHeight / 2,
    }
  }
  useImperativeHandle(fRef, ()=>({
    getPos,
  }));

  return (
    <div className={`${style.container} ${!props.isInput ? style.output : ''}`}
      onMouseDown={stopEventPropagation}
    >
      <div className={style.jointContainer}>
        <div className={style.joint} ref={ref}
          onMouseDown={props.operateNewConnection}
          onMouseUp={props.registerNewConnection}
        />
      </div>
      <p className={style.nameBox}>{props.socket.name}</p>
    </div>
  )
});

export default IO;
