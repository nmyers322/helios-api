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
  const fetchingCart = useSelector(state => state.cart.fetching);
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
        || valueIsEmpty(customer.username)
        || fetchingCart;
      if (cannotContinue) {
        heliosLogger("Fetching data. Waiting to proceed.");
        heliosLogger(fetchingProductsOrVariations, 
          !products, 
          products.length === 0, 
          !variations, 
          variations.length === 0, 
          valueIsEmpty(customer.username),
          fetchingCart);
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
      dispatch(setFetchingCart(true));
      const cart = await fetchCart();
      if (orderForm && validateCompleteOrderForm(orderForm).isValid) {
        let addToCartPromise;
        // Let's create a timer so we can time these calls.
        let startTime = new Date().getTime();
        if (!validateCart(cart).isValid || !orderFormSameAsCart(orderForm, cart)) {
          await emptyCart(cart);
          heliosLogger("Empty cart took: " + (new Date().getTime() - startTime) + "ms");
          addToCartPromise = addOrderFormToCart(orderForm, products).then(() => {
            heliosLogger("Add to cart took: " + (new Date().getTime() - startTime) + "ms");
            dispatch(setFetchingCart(false));
          });
        }
        heliosLogger("Checking customer addresses", customer);
        if (!validateAddress(customer.billing?.[0], "billing").isValid) {
          goTo("/account/billing-address");
        } else if (!validateAddress(customer.shipping?.[0], "shipping").isValid) {
          goTo("/account/shipping-address");
        } else {
          if (addToCartPromise) {
            await addToCartPromise;
            heliosLogger("Add to cart promise took: " + (new Date().getTime() - startTime) + "ms. Heading to checkout");
          }
          goTo("/checkout");
        }
      } else if (validateCart(cart).isValid) {
        // To-do: Convert remote cart to local order form then proceed to billing and remove the following 2 lines
        heliosLogger("Invalid cart. Emptying cart and navigating to home.");
        emptyCart(cart);
        goTo("/");
      } else {
        heliosLogger("Invalid order form and cart. Emptying cart and navigating to home.");
        emptyCart(cart);
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
    fetchingCart, 
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
        <LabeledSpinner text={"Preparing your order. Please wait up to one minute, and do not navigate away from this page."} />
      </Modal>
    </LoginSuccessContainer>
  );
};

export default LoginSuccessPage;