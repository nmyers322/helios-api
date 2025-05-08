import React, { useEffect, useRef, useState } from "react";
import { WCPageContainer } from "../../styles/Page";
import { useSelector } from "react-redux";
import Modal from "../main/Modal";
import LabeledSpinner from "../main/LabeledSpinner";
import "../../styles/CheckoutPage.css";
import ContactAndShippingInformationCard from "../card/checkout/ContactAndShippingInformationCard";
import OrderDetailsCard from "../card/checkout/OrderDetailsCard";
import { CheckoutPageCardColumn, CheckoutPageContainer, OrderSummaryContainerLarge, OrderSummaryContainerSmall } from "../../styles/CheckoutPage";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useGoTo } from "../../modules/links";
import { getCurrentOrderStep, isOrderInProgress, validateCompleteOrderForm } from "../../modules/orderFormValidation";
import { HEADER_HEIGHT } from "../../styles/GlobalStyle";
import { remToPx } from "../../modules/serialization";
import OrderSummarySidePanel from "../sidebar/OrderSummarySidePanel";
import CheckoutCard from "../card/checkout/CheckoutCard";
import Button from "../form/main/Button";
import OrderDetailsAndContactStep from "../step/checkout/OrderDetailsAndContactStep";
import ShippingOptionsStep from "../step/checkout/ShippingOptionsStep";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const customer = useSelector((state) => state.customer);
  const [isCheckoutSubmitted, setIsCheckoutSubmitted] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [modalText, setModalText] = useState("Fetching your details...");
  const localSettingsLoaded = useSelector(state => state.meta.localSettingsLoaded);
  const orderForm = useSelector(state => state.orderForm);
  const readyForCheckout = useSelector(state => state.meta.readyForCheckout);
  const cartSummaryRef = useRef(null);

  useEffect(() => {
    if (!isFirstLoad) {
      return;
    }
    setIsFirstLoad(false);
    if (localSettingsLoaded) {
      if (!readyForCheckout 
        || !validateCompleteOrderForm(orderForm).isValid
        || !customer.hasActiveToken) {
        setModalText("Not ready for checkout. Redirecting...");
        if (isOrderInProgress(orderForm)) {
          goTo(`/order/${getCurrentOrderStep(orderForm)}`);
        } else {
          goTo("/");
        }
      }
    }
  }, [goTo, isFirstLoad, localSettingsLoaded, orderForm, readyForCheckout]);

  return (
    <WCPageContainer>
      { (!customer.hasActiveToken || customer?.fetching) && 
        <Modal>
          <LabeledSpinner text={modalText} />
        </Modal>
      }
      { !customer?.fetching &&
        <CheckoutPageContainer>
          {/* <OrderSummaryContainerSmall>
            <OrderSummarySidePanel
              disabled={isCheckoutSubmitted} />
          </OrderSummaryContainerSmall> */}
          <CheckoutPageCardColumn>
            <Routes>
              <Route path="/" element={<OrderDetailsAndContactStep isCheckoutSubmitted={isCheckoutSubmitted} />} />
              <Route path="/shipping" element={<ShippingOptionsStep isCheckoutSubmitted={isCheckoutSubmitted} />} />
            </Routes>
          </CheckoutPageCardColumn>
          <OrderSummaryContainerLarge>
            <OrderSummarySidePanel
              disabled={isCheckoutSubmitted} />
          </OrderSummaryContainerLarge>
        </CheckoutPageContainer>
      }
    </WCPageContainer>
  );
};

export default CheckoutPage;