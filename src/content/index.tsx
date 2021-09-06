import React from 'react';
import ContentType, { Modes } from './types';
import Canvas from './Canvas';
import Counter from './Counter';

type Props = {
  node: ContentType;
};

const Content: React.FC<Props> = ({ node }) => {
  switch (node.mode) {
    case (Modes.canvas): return <Canvas render={()=>{}}/>;
    case (Modes.counter): return <Counter node={node}/>;
  }
  return (
    <React.Fragment/>
  );
}

export default Content;
