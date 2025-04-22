import styled from "styled-components";

export const CheckoutPageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 0;
  margin-right: 0;
  height: 100%;
  box-sizing: border-box;
  width: (100vw - 30rem);

  @media (max-width: 40rem) {
    width: 100vw;
  }
`;

export const CheckoutPageCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: calc(100vw - 30rem);
  height: 100%;
  box-sizing: border-box;
  margin-left: 0;

  @media (max-width: 40rem) {
    width: 100vw;
  }
`;

export const OrderSummaryContainerSmall = styled.div`
    display: none;

    @media (max-width: 40rem) {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        box-sizing: border-box;
        padding-top: 0;
        margin-bottom: 3rem;
    }
`;

export const OrderSummaryContainerLarge = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 25rem;
  right: 2rem;
  top: var(--header-height);
  align-self: flex-start; 
  box-sizing: border-box;
  max-height: var(--header-height);
  z-index: 1;
  transition: top 0.1s ease-in-out;
  overflow-y: visible;

  @media (max-width: 40rem) {
    display: none;
  }
`;