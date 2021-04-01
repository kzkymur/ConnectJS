import React from 'react';
import style from '@/style/Base/Main.scss';

type Props = {
  element: React.ReactNode;
  posChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  fRef: React.RefObject<HTMLDivElement>;
}

const Main: React.FC<Props> = props => {
  return (
    <div ref={props.fRef} className={style.main} 
        onMouseDown={props.posChange}
    >
      {props.element}
    </div>
  )
}

export default Main;
