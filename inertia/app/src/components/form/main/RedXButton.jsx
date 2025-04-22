import React from 'react';
import styled from 'styled-components';

const StyledRedXButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  min-width: 1.5rem;
  height: 1.5rem;
  min-height: 1.5rem;
  background-color: red;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  margin: 0 0.5rem;
  box-sizing: border-box;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 1rem;
    height: 0.2rem;
    background-color: white;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const RedXButton = ({ className, onClick, styles }) => {
  return (
    <StyledRedXButton onClick={onClick} className={className} style={styles} />
  );
};

export default RedXButton;