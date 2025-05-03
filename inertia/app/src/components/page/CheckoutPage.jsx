import React, { useEffect, useRef, useState } from "react";
import { WCPageContainer } from "../../styles/Page";
import { useSelector } from "react-redux";
import Modal from "../main/Modal";
import LabeledSpinner from "../main/LabeledSpinner";
import "../../styles/CheckoutPage.css";
import ContactAndShippingInformationCard from "../card/checkout/ContactAndShippingInformationCard";
import CartSummaryCard from "../card/checkout/CartSummaryCard";
import OrderDetailsCard from "../card/checkout/OrderDetailsCard";
import { CheckoutPageCardColumn, CheckoutPageContainer, OrderSummaryContainerLarge, OrderSummaryContainerSmall } from "../../styles/CheckoutPage";
import { useNavigate } from "react-router-dom";
import { useGoTo } from "../../modules/links";
import { getCurrentOrderStep, isOrderInProgress, validateCompleteOrderForm } from "../../modules/orderFormValidation";
import { HEADER_HEIGHT } from "../../styles/GlobalStyle";
import { remToPx } from "../../modules/serialization";

const CHECKOUT_BUTTON_CLASS = "wc-block-components-checkout-place-order-button";

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
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const checkoutButtons = document.querySelectorAll(`.${CHECKOUT_BUTTON_CLASS}`);
          if (checkoutButtons.length > 0) {
            checkoutButtons.forEach((button) => {
              button.addEventListener("click", () => {
                setIsCheckoutSubmitted(true);
              });
            });
            // Stop observing once the buttons are found and listeners are attached
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const topPadding = remToPx(HEADER_HEIGHT) + 80;
    const bottomPadding = 20;
    const handleScroll = () => {
      const cartSummary = cartSummaryRef.current;
      if (!cartSummary) return;

      let viewportHeight = document.documentElement.clientHeight;
      let cartSummaryCardHeight = cartSummary.firstChild?.offsetHeight || 0;
      let bottomScrollLimit = window.scrollY - cartSummaryCardHeight + viewportHeight - bottomPadding;
      let newScrollPosition = Math.max(topPadding, Math.min(bottomScrollLimit, window.scrollY));

      cartSummary.style.top = newScrollPosition + "px";
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cartSummaryRef]);

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
          <CheckoutPageCardColumn>
            <OrderDetailsCard
              disabled={isCheckoutSubmitted} />
            <OrderSummaryContainerSmall>
              <CartSummaryCard
                disabled={isCheckoutSubmitted} />
            </OrderSummaryContainerSmall>
            <ContactAndShippingInformationCard 
              disabled={isCheckoutSubmitted}
              isEditable={!isCheckoutSubmitted} />
          </CheckoutPageCardColumn>
          <OrderSummaryContainerLarge ref={cartSummaryRef}>
            <CartSummaryCard
              disabled={isCheckoutSubmitted} />
          </OrderSummaryContainerLarge>
        </CheckoutPageContainer>
      }
    </WCPageContainer>
  );
};

export default CheckoutPage;