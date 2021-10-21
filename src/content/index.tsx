import React, {useEffect, useState} from 'react';
import ContentType, { Modes } from './types';
import Canvas from './Canvas';
import Counter from './Counter';
import Plus from './Plus';
import Minus from './Minus';
import Multiply from './Multiply';
import Divide from './Divide';
import Timmer from './Timmer';

type Props = {
  node: ContentType;
};
const Content: React.FC<Props> = ({ node }) => {
  const forceUpdate = useForceUpdate();
  useEffect(()=>{ node.rerender = forceUpdate; }, []);

  switch (node.mode) {
    case (Modes.canvas): return <Canvas render={()=>{}}/>;
    case (Modes.counter): return <Counter node={node}/>;
    case (Modes.plus): return <Plus node={node}/>;
    case (Modes.minus): return <Minus node={node}/>;
    case (Modes.multiply): return <Multiply node={node}/>;
    case (Modes.divide): return <Divide node={node}/>;
    case (Modes.timmer): return <Timmer node={node}/>;
  }
}

export default Content;

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue(value => value + 1);
}
