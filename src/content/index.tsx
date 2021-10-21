import React, {useEffect, useState} from 'react';
import ContentType, { Modes } from './types';
import Canvas from './Canvas';
import Counter from './Counter';
import Sum from './Sum';
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
    case (Modes.sum): return <Sum node={node}/>;
    case (Modes.timmer): return <Timmer node={node}/>;
  }
}

export default Content;

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue(value => value + 1);
}
