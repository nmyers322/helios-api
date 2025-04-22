import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setReadyForCheckout } from "../../../actions/metaActions";
import { saveLocalOrderForm, updateOrderFormField } from "../../../actions/orderFormActions";
import { useGoTo } from "../../../modules/links";
import BackButton from "../../form/main/BackButton";
import ContinueAndSaveButton from "../../form/main/ContinueAndSaveButton";
import ErrorText from "../../form/main/ErrorText";
import ShowQuoteButton from "../../form/main/ShowQuoteButton";

export const OrderFormCardContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 2rem 1.5rem 2rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 1rem;
  margin-left: 1rem;
  width: calc(100% - 12rem);
  max-width: 40rem;

  @media (max-width: 30rem) {
    padding: 1rem 2rem 1.5rem 2rem;
    width: calc(100% - 4rem);
  }
`;

const OrderFormCardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-top: 1rem;
`;

const OrderFormCardContent = styled.div`
  flex-grow: 1;
`;

const ErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const OrderFormCard = ({
  backLink,
  className = "",
  children,
  continueLink,
  disabled = false,
  errorMsg,
  onSubmit = () => {},
  shouldUpdateOrder = true,
  showContinueButton = true,
  showQuoteButton = true,
  title,
}) => {
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const dispatch = useDispatch();
  const orderForm = useSelector((state) => state.orderForm);

  return (
    <OrderFormCardContainer className={`${className}`}>
      <OrderFormCardTitle>
        <h2>{title}</h2>
        {backLink && (
          <BackButton
            onClick={(event) => {
              event.preventDefault();
              goTo(backLink);
            }}
          />
        )}
      </OrderFormCardTitle>
      <OrderFormCardContent>{children}</OrderFormCardContent>
      { errorMsg && (
        <ErrorTextContainer>
          <ErrorText text={errorMsg} />
        </ErrorTextContainer>
      )}
      { showContinueButton && <ContinueAndSaveButton
        disabled={disabled}
        onClick={(event) => {
          event.preventDefault();
          if (disabled) return;
          if (shouldUpdateOrder) {
            dispatch(setReadyForCheckout(false));
            dispatch(saveLocalOrderForm(orderForm));
          }
          onSubmit();
          !!continueLink && goTo(continueLink);
        }}
      /> }
      { showQuoteButton && <ShowQuoteButton
        buttonText={"View Quote"}
        onClick={(event) => {
          event.preventDefault();
          dispatch(updateOrderFormField("showQuoteOnMobile", true));
        }} /> }

    </OrderFormCardContainer>
  );
};

export default OrderFormCard;
