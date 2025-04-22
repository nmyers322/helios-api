import styled from "styled-components";

const StyledButtonWithSpecialHover = styled.button`
  display: inline-block;
  color: ${(props) => props.theme.colors.buttonText};
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: ${(props) => props.theme.colors.primary};
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
  margin-top: var(--top-bottom-spacing);

  &:disabled {
    background-color: ${(props) => props.theme.colors.disabledBackground};
    color: ${(props) => props.theme.colors.disabledText};
    cursor: not-allowed;
    opacity: 0.65;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background-color: ${(props) => props.theme.colors.secondary};
    border-radius: 1rem;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.6s ease-out;
    z-index: 0;
  }

  &:hover::before {
    transform: translate(-50%, -50%) scale(1);
  }

  &:hover {
    color: ${(props) => props.theme.colors.invertedButtonText};
  }

  & > span {
    position: relative;
    z-index: 1;
  }
`;

const ButtonBigCTA = ({ 
  buttonText, 
  className, 
  disabled,
  onClick,
  styles = {} 
}) => {
  return (
    <StyledButtonWithSpecialHover className={className} disabled={disabled} onClick={onClick} style={styles}>
      <span>{buttonText}</span>
    </StyledButtonWithSpecialHover>
  );
  
};

export default ButtonBigCTA;