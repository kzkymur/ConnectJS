import React from 'react';
import styled from 'styled-components';
import { Timmer as Class } from './types';

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
