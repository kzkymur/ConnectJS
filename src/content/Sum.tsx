import React from 'react';
import styled from 'styled-components';
import { keys } from 'ts-transformer-keys';
import { MovableNode } from '@/store/main/node';
import { Modes } from './types';

type SumArgs = { a: number; b: number; };
type To = { sum: number; };
export class Class extends MovableNode<To, SumArgs> {
  readonly mode: typeof Modes.sum = Modes.sum;
  constructor () {
    super(keys<SumArgs>(), keys<To>());
    this.function = ({a, b}) => { return { sum: a + b }; }
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
      <Indicator>{ node.value.sum }</Indicator>
    </Container>
  );
}

export default Sum;
