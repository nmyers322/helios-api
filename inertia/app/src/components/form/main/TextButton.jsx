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

const TextButton = (props) => {
  return (
      <StyledButton onClick={props.onClick}>
        {props.text}
      </StyledButton>
  );
};

export default TextButton;