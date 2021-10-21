import React from 'react';
import styled from 'styled-components';
import { keys } from 'ts-transformer-keys';
import { MovableNode } from '@/store/main/node';
import { Modes } from './types';

type Args = { a: number; b: number; };
type To = { difference: number; };
export class Class extends MovableNode<To, Args> {
  readonly mode: typeof Modes.minus = Modes.minus;
  constructor () {
    super(keys<Args>(), keys<To>());
    this.function = ({a, b}) => { return { difference: a - b }; }
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

const Minus: React.FC<Props> = ({ node }) => {
  return (
    <Container>
      <Indicator>{ node.value.difference }</Indicator>
    </Container>
  );
}

export default Minus;
