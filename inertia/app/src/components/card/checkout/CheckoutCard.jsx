import React from "react";
import styled from "styled-components";

const CheckoutCardContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 5rem 1.5rem 5rem;
  border-radius: 1rem;
  width: 35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: var(--top-bottom-spacing);
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  @media (max-width: 57rem) {
    width: calc(100% - 4rem);
    padding: 1rem 2rem 1.5rem 2rem;
  }
`;

const CheckoutCardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-top: 1rem;
`;

const CheckoutCardContent = styled.div`
  flex-grow: 1;
`;

const WidthGrowWrapper = styled.div`
  width: 100% !important;
`;

const CheckoutCard = ({
  className = "",
  children,
  disabled = false,
  title,
}) => {

  return (
    <CheckoutCardContainer className={`${className}`} disabled={disabled}>
      <WidthGrowWrapper>
        { title && 
          <CheckoutCardTitle>
            <h2>{title}</h2>
          </CheckoutCardTitle> 
        }
        <CheckoutCardContent>{children}</CheckoutCardContent>
      </WidthGrowWrapper>
    </CheckoutCardContainer>
  );
};

export default CheckoutCard;
