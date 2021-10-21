import React from 'react';
import styled from 'styled-components';
import { keys } from 'ts-transformer-keys';
import { MovableNode } from '@/store/main/node';
import { Modes } from './types';

type Args = { a: number; b: number; };
type To = { quotient: number; remaining: number; };
export class Class extends MovableNode<To, Args> {
  readonly mode: typeof Modes.divide = Modes.divide;
  constructor () {
    super(keys<Args>(), keys<To>());
    this.function = ({a, b}) => {
      return {
        quotient: Math.floor(a * b),
        remaining: a % b,
      };
    };
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
const SwitchButton = styled.button`
  height: 30px;
  background: white;
  color: black;
  display: inline-block;
`;

const Minus: React.FC<Props> = ({ node }) => {
  return (
    <Container>
      <Indicator>{ node.value.quotient }</Indicator>
      <Indicator>{ node.value.quotient }</Indicator>
      <Indicator>{ node.value.quotient }</Indicator>
      <SwitchButton>{ node.value.quotient }</SwitchButton>
    </Container>
  );
}

export default Minus;
