import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  margin-top: var(--top-bottom-spacing);
  margin-bottom: var(--top-bottom-spacing);
  background-color: ${(props) => props.theme.colors.background};
`;

export const WCPageContainer = styled.div`
  margin-top: var(--top-bottom-spacing);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
`;

export const PageLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 20rem;
  min-width: 20rem;
  height: 100%;

  @media (max-width: 50rem) {
    display: none;
  }
`;

export const PageCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

export const PageRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 25rem;
  margin-right: 1rem;
  height: 100%;

  @media (max-width: 69rem) {
    display: none;
  }
`;

export const EmptyDiv = styled.div`
  display: none;
`;

export const ViewOnMobileOnly = styled.div`
  display: none;

  @media (max-width: 40rem) {
    display: block;
  }
`;

export const ViewOnMobileAndTabletOnly = styled.div`
  display: none;

  @media (max-width: 69rem) {
    display: block;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${(props) => props.theme.colors.text};
`;