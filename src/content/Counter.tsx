import React, { useCallback } from 'react';
import { Counter as Class } from './types';

type Props = {
  node: Class;
};

const Counter: React.FC<Props> = props => {
  const increment = useCallback(() => {
    props.node.setArg({});
  },[]);
  console.log(props);
  return (
    <button onClick={increment}/>
  );
}

export default Counter;
