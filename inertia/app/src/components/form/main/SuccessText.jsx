import styled from "styled-components";

const StyledSuccessText = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
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


const SuccessText = ({ text }) => {
    return <StyledSuccessText>{text}</StyledSuccessText>;
}

export default SuccessText;