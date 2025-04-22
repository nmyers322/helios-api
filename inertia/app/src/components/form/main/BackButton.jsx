import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  text-decoration: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: inherit;
  font: inherit;
`;

const BackButton = (props) => {
  return (
      <StyledButton onClick={props.onClick}>
        ← Go Back
      </StyledButton>
  );
};

export default BackButton;