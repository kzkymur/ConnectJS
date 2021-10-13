import React from 'react';
import styled from 'styled-components';
import { MovableNode } from '@/store/main/node';
import { Modes } from './types';

export class Class extends MovableNode<number, {}> {
  readonly mode: typeof Modes.timmer = Modes.timmer;
  time: number;
  constructor () {
    super(() => 0, []);
    this.time = 0;
    this.outputs = [{
      type: 1,
      id: 1,
      name: 'timmer',
    }];
    this.function = () => { return this.time++; }
    setInterval(()=>{
      this.arg = {};
    }, 1000);
  }
}

type Props = {
  node: Class;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Indicator = styled.span`
  height: 30px;
  background: white;
  color: black;
  display: inline-block;
`;

const Timmer: React.FC<Props> = ({ node }) => {
  return (
    <Container>
      <Indicator>{ node.time }</Indicator>
    </Container>
  );
}

export default Timmer;
