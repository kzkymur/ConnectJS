import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Counter as Class } from './types';

type Props = {
  node: Class;
};

const Button = styled.button`
`;

const Counter: React.FC<Props> = ({ node }) => {
  const increment = useCallback(() => {
    node.setArg({});
  },[]);
  return (
    <div>
      <button onClick={increment}/>
      <span>{ node.counter }</span>
    </div>
  );
}

export default Counter;
