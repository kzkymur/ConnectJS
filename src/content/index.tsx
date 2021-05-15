import React from 'react';
import { NodeModes, NodeModeType } from '@/store/node/nodeTypes';
import Canvas from './Canvas';
import Counter from './Counter';

type Props = {
  mode: NodeModeType;
};

const Content: React.FC<Props> = props => {
  switch (props.mode) {
    case (NodeModes.canvas): return <Canvas render={()=>{}}/>;
    case (NodeModes.counter): return <Counter/>;
  }
  return (
    <React.Fragment/>
  );
}

export default Content;
