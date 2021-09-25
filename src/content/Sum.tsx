import React from 'react';
import styled from 'styled-components';
import { Sum as Class } from './types';

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
