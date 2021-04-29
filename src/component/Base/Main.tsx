import React, { ReactNode, RefObject } from 'react';
import style from '@/style/Base/Main.scss';

type Props = {
  element: ReactNode;
  fRef: RefObject<HTMLDivElement>;
}

const Main: React.FC<Props> = props => {
  return (
    <div ref={props.fRef} className={style.main}>
      {props.element}
    </div>
  )
}

export default Main;
