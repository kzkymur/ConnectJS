import React from 'react';
import { OutputType } from '../store/types';

type Props = {
  type: OutputType;
  iId: number,
  iCh: number,
  oId: number,
  oCh: number,
}
const Connection: React.FC<Props> = props => {

  return (
    <path d="M -100,0 Q 0 0 0 50 T 100 100" fill="none" stroke="black"/>
  )
}

export default Connection;

