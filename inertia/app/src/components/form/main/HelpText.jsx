import styled from "styled-components";

const StyledHelpText = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 0.8rem;
  font-weight: 800;
  margin-top: 0.2rem;
  text-align: left;
  width: 100%;
  user-select: none;
  pointer-events: none;
  font-family: inherit;
  display: flex;
  align-items: center;
`;


const HelpText = ({ text }) => {
    return <StyledHelpText>{text}</StyledHelpText>;
}

export default HelpText;