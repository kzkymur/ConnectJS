import React from 'react';
import styled from 'styled-components';
import { keys } from 'ts-transformer-keys';
import { MovableNode } from '@/store/main/node';
import { Modes } from './types';

type SumArgs = { a: number; b: number; };
export class Class extends MovableNode<number, SumArgs> {
  readonly mode: typeof Modes.sum = Modes.sum;
  constructor () {
    super(() => 0, keys<SumArgs>());
    this.inputs = [
      {
        type: 1,
        id: 1,
        name: 'a',
      },
      {
        type: 1,
        id: 2,
        name: 'b',
      }
    ];
    this.outputs = [{
      type: 1,
      id: 1,
      name: 'sum',
    }];
    this.function = ({a, b}) => { return a + b; }
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

const Sum: React.FC<Props> = ({ node }) => {
  return (
    <Container>
      <Indicator>{ node.output }</Indicator>
    </Container>
  );
}

export default Sum;
