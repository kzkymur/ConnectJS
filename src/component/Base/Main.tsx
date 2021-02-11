import React from 'react';
import style from '@/style/Base/Main.scss';

type Props = {
  element: React.ReactNode;
  startMoving: (e: React.MouseEvent) => void;
  fRef: React.RefObject<HTMLDivElement>;
}

const Main: React.FC<Props> = props => {
  return (
    <div ref={props.fRef} className={style.main} 
        onMouseDown={props.startMoving}>
      {props.element}
    </div>
  )
}

export default Main;
