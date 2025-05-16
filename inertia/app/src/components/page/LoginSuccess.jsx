import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setFetchingCart } from "../../actions/cartActions";
import { validateAddress } from "../../modules/accountValidation";
import { addOrderFormToCart, emptyCart, orderFormSameAsCart, validateCart } from "../../modules/cart";
import { getOrderFormFromLocalStorage } from "../../modules/dataPersistMiddleware";
import { useGoTo } from "../../modules/links";
import { heliosLogger } from "../../modules/logging";
import { validateCompleteOrderForm } from "../../modules/orderFormValidation";
import { valueIsEmpty } from "../../modules/validation";
import { fetchCart } from "../../modules/wordpressApi";
import LabeledSpinner from "../main/LabeledSpinner";
import Modal from "../main/Modal";
import { updateOrderFormField } from "../../actions/orderFormActions";

const LoginSuccessContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const LoginSuccessPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const fetchingProductsOrVariations = useSelector(state => state.products.fetchingProductsOrVariations);
  const customer = useSelector(state => state.customer);
  const products = useSelector(state => state.products.products);
  const variations = useSelector(state => state.products.variations);
  const readyForCheckout = useSelector(state => state.meta.readyForCheckout);
  const localSettingsLoaded = useSelector(state => state.meta.localSettingsLoaded);
  const [firstLoad, setFirstLoad] = React.useState(true);

  useEffect(() => {
    const handleLoginSuccessCheckoutFlow = async () => {
      const cannotContinue = fetchingProductsOrVariations 
        || !products 
        || products.length === 0 
        || !variations 
        || variations.length === 0 
        || !customer.hasActiveToken
        || valueIsEmpty(customer?.id);
      if (cannotContinue) {
        heliosLogger("Fetching data. Waiting to proceed.");
        heliosLogger(fetchingProductsOrVariations, 
          !products, 
          products.length === 0, 
          !variations, 
          variations.length === 0,
          !customer.hasActiveToken);
        return;
      }
      if (!firstLoad) {
        return;
      }
      setFirstLoad(false);
      heliosLogger("Handling login success checkout flow");
      heliosLogger("Customer", customer);
      if (!readyForCheckout) {
        // Just a fail safe. If we're not ready for checkout, we should not be here.
        heliosLogger("Not ready for checkout. Navigating to home. (Fail safe)");
        goTo("/");
        return;
      }
      const orderForm = getOrderFormFromLocalStorage();
      if (orderForm && validateCompleteOrderForm(orderForm).isValid) {
        heliosLogger("Checking customer addresses", customer);
        if (!validateAddress(customer.billing?.[0], "billing").isValid) {
          goTo("/account/billing-address");
        } else if (!validateAddress(customer.shipping?.[0], "shipping").isValid) {
          dispatch(updateOrderFormField("billing", customer.billing[0]));
          goTo("/account/shipping-address");
        } else {
          dispatch(updateOrderFormField("billing", customer.billing[0]));
          dispatch(updateOrderFormField("shipping", customer.shipping[0]));
          goTo("/checkout");
        }
      } else {
        heliosLogger("Invalid order form. Navigating to home.");
        goTo("/");
      }
    }
    if (readyForCheckout) {
      handleLoginSuccessCheckoutFlow();
    } else if (localSettingsLoaded) {
      heliosLogger("Not ready for checkout. Navigating to home.");
      goTo("/");
    }
  }, [
    customer, 
    dispatch,
    fetchingProductsOrVariations, 
    firstLoad,
    goTo,
    localSettingsLoaded, 
    products, 
    readyForCheckout,
    variations]);

  return (
    <LoginSuccessContainer>
      <Modal>
        <LabeledSpinner text={"Preparing your order..."} />
      </Modal>
    </LoginSuccessContainer>
  );
};

export default LoginSuccessPage;