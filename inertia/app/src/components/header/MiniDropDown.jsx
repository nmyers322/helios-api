import styled from "styled-components";

export const MiniDropDownContainer = styled.div`
    position: absolute;
    top: var(--header-height);
    width: 20rem;
    background-color: ${(props) => props.theme.colors.modalBackground};
    box-shadow: 0 0 5rem rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.5s ease-in-out;
    z-index: 1;
    display: ${(props) => (props.open ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.text};
    text-decoration: none;
    transition: all 0.3s linear;
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: ${(props) => props.theme.colors.cardBackground};
    }

    div {
        margin: 1rem;
    }
`;

export const CloserCapturer = styled.div`
    position: fixed;
    margin: 0 !important;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
`;

const MiniDropDown = ({ closer, children, open }) => {
  return (
    <MiniDropDownContainer open={open}>
      {children}
      <CloserCapturer onClick={() => closer && closer()} />
    </MiniDropDownContainer>
  );
};

export default MiniDropDown;