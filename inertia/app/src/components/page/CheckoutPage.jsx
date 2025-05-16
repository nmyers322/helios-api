import React, { useEffect, useRef, useState } from "react";
import { WCPageContainer } from "../../styles/Page";
import { useSelector } from "react-redux";
import Modal from "../main/Modal";
import LabeledSpinner from "../main/LabeledSpinner";
import "../../styles/CheckoutPage.css";
import { CheckoutPageCardColumn, CheckoutPageContainer, OrderSummaryContainerLarge, OrderSummaryContainerSmall } from "../../styles/CheckoutPage";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useGoTo } from "../../modules/links";
import { getCurrentOrderStep, isOrderInProgress, validateCompleteOrderForm } from "../../modules/orderFormValidation";
import OrderSummarySidePanel from "../sidebar/OrderSummarySidePanel";
import ShippingOptionsStep from "../step/checkout/ShippingOptionsStep";
import PaymentOptionsStep from "../step/checkout/PaymentOptionsStep";
import ReviewStep from "../step/checkout/ReviewStep";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const customer = useSelector((state) => state.customer);
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
              <Route path="/" element={<ShippingOptionsStep />} />
              <Route path="/shipping" element={<ShippingOptionsStep />} />
              <Route path="/payment" element={<PaymentOptionsStep />} />
              <Route path="/review" element={<ReviewStep />} />
            </Routes>
          </CheckoutPageCardColumn>
          <OrderSummaryContainerLarge>
            <OrderSummarySidePanel />
          </OrderSummaryContainerLarge>
        </CheckoutPageContainer>
      }
    </WCPageContainer>
  );
};

export default CheckoutPage;