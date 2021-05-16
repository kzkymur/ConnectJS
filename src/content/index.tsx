import React from 'react';
import { Modes, ModeType } from './types';
import Canvas from './Canvas';
import Counter from './Counter';

type Props = {
  mode: ModeType;
};

const Content: React.FC<Props> = props => {
  switch (props.mode) {
    case (Modes.canvas): return <Canvas render={()=>{}}/>;
    case (Modes.counter): return <Counter/>;
  }
  return (
    <React.Fragment/>
  );
}

export default Content;
