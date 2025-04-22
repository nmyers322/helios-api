import styled from "styled-components";

export const ButtonContainer = styled.div`
  display: none;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  border: 0px;
  line-height: 1.5;
  border-radius: 0;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 800;
  font-family: inherit;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    display: none;
    position: relative;
    width: 0;
    height: .2rem;
    background-color: ${props => props.theme.colors.primary};
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }

  &::after {
    display: none;
  }

  @media (max-width: 69rem) {
    display: inline-block;
    &::after {
      display: block;
    }
  }
`;

export const StyledButton = styled.button`
  display: inline-block;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: ${(props) => props.theme.colors.tertiary};
  border: 0px;
  padding: 0.6rem 2.4rem;
  line-height: 1.5;
  border-radius: 0;
  cursor: pointer;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 800;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  margin: 0;

  &:disabled {
    background-color: ${(props) => props.theme.colors.disabledBackground};
    color: ${(props) => props.theme.colors.disabledText};
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const ShowQuoteButton = ({ 
  buttonText, 
  className, 
  disabled,
  onClick,
  styles = {} 
}) => {
  return (
    <ButtonContainer style={styles}>
      <StyledButton className={className} disabled={disabled} onClick={onClick} style={styles}>
        <span>{buttonText}</span>
      </StyledButton>
    </ButtonContainer>
  );
};

export default ShowQuoteButton;