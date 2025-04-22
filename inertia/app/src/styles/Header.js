import styled from "styled-components";

export const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.headerBackground};
  color: ${(props) => props.theme.colors.text};
  width: 100%;
  height: var(--header-height);
  z-index: 1;
`;

export const HeaderTitle = styled.h1`
  font-size: 3rem;
  user-select: none;

  @media (max-width: 40rem) {
    display: none;
  }
`;

export const StyledWCHeader = styled(StyledHeader)`
  position: fixed;
  top: 0;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

export const SubHeader = styled.div`
  position: fixed;
  top: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.headerBackground};
  color: ${(props) => props.theme.colors.text};
  width: 100%;
  height: var(--header-height);
  z-index: 1;
`;