import styled from "styled-components";

export const FormInputRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 1rem 0;

  & > * {
    margin: 0 0 0 0 !important;
  }
`;

export const FormInputColumnSpacer = styled.div`
  height: 1rem;
  tabindex: -1;
`;

export const FormInputContainer = styled.div`
  position: relative;
  margin: .8rem 0;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

export const FormInputContainerHorizontal = styled.div`
  position: relative;
  margin: .8rem 0;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const FormInputRowSpacer = styled.div`
  width: 1rem;
  tabindex: -1;
`;