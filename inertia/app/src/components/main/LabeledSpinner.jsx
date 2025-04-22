import React from 'react';
import Spinner from './Spinner';
import styled from 'styled-components';


const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 5rem;
  margin-bottom: 5rem;

  span {
    font-size: .9rem;
    padding-top: 1rem;
  }
`;

const LabeledSpinner = ({text}) => {
  return (
    <SpinnerContainer>
      <Spinner />
      <span>{text}</span>
    </SpinnerContainer>
  );
};

export default LabeledSpinner;