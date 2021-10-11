import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { keys } from 'ts-transformer-keys';
import { MovableNode } from '@/store/main/node';
import { Modes } from './types';

export class Class extends MovableNode<number, {}> {
  readonly mode: typeof Modes.counter = Modes.counter;
  counter: number;
  constructor () {
    super(() => 0, keys());
    this.counter = 0;
    this.outputs = [{
      type: 1,
      id: 1,
      name: 'counter',
    }];
    this.function = () => { return ++this.counter; }
  }
}

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
