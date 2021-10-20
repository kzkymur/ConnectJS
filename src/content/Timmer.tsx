import React from 'react';
import styled from 'styled-components';
import { keys } from 'ts-transformer-keys';
import { MovableNode } from '@/store/main/node';
import { Modes } from './types';

type To = { time: number };
export class Class extends MovableNode<To, {}> {
  readonly mode: typeof Modes.timmer = Modes.timmer;
  time: number;
  constructor () {
    super(keys(), keys<To>());
    this.time = 0;
    this.function = () => { return { time: this.time++, } };
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
