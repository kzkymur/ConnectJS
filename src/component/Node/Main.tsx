import React, { ReactNode, RefObject } from 'react';
import style from '@/style/Node/Main.scss';

type Props = {
  children: ReactNode;
  fRef: RefObject<HTMLDivElement>;
}

const Main: React.FC<Props> = props => {
  return (
    <div ref={props.fRef} className={style.main}>
      {props.children}
    </div>
  )
}

export default Main;
