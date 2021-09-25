import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Counter as Class } from './types';

type Props = {
  node: Class;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Button = styled.button`
  height: 30px;
  width: 40%;
  display: inline-block;
`;

const Indicator = styled.span`
  height: 30px;
  width: 60%;
  background: white;
  color: black;
  display: inline-block;
`;

const Counter: React.FC<Props> = ({ node }) => {
  const [count, setCount] = useState(node.counter);
  const increment = useCallback(() => {
    node.setArg({});
    setCount(count+1);
  }, [count]);
  useEffect(()=>{
    setCount(node.counter);
  }, [node.counter])
  return (
    <Container>
      <Button onClick={increment}/>
      <Indicator>{ count }</Indicator>
    </Container>
  );
}

export default Counter;
