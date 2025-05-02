import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { heliosLogger } from "../../modules/logging.js";
import { getUserId, isUserLoggedIn } from "../../modules/authorization.js";
import { setFetchingCustomer, updateCustomerFromApiResponse } from "../../actions/customerActions.js";
import { fetchCart, fetchCustomer, fetchOrder } from "../../modules/wordpressApi.js";
import { updateBillingAddressFormFromApiResponse } from "../../actions/billingAddressActions.js";
import { updateShippingAddressFormFromApiResponse } from "../../actions/shippingAddressActions.js";
import { getCheckoutStatusFromLocalStorage, getIsBetaFromLocalStorage, getOrderFormFromLocalStorage, getThemeFromLocalStorage } from "../../modules/dataPersistMiddleware.js";
import { updateOrderForm } from "../../actions/orderFormActions.js";
import { fetchAllProductsAndAllVariations, invalidateProductCache, setProducts, setVariations } from "../../actions/productsActions.js";
import { setFetchingOrders, setOrderError, updateOrder } from "../../actions/ordersActions.js";
import { getOrderNumber } from "../../modules/orders.js";
import { setIsBeta, setLocalSettingsLoaded, setReadyForCheckout, updateTheme } from "../../actions/metaActions.js";
import { order452 } from "../../mocks/orders.js";
import { isLocal } from "../../modules/environment.js";
import { PRODUCTS_VARIATIONS_CACHE_KEY } from "./App.js";
import { valueIsEmpty } from "../../modules/validation.js";
import { customerMock } from "../../mocks/customer.js";
import { setCart, setFetchingCart } from "../../actions/cartActions.js";

const StyledDataLoader = styled.div`
    display: none;
`;

const DataLoader = (props: any) => {

    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);
    const customer = useSelector((state) => state.customer);
    const orders = useSelector((state) => state.orders);
    const meta = useSelector((state) => state.meta);

    heliosLogger("DataLoader props", props);

    useEffect(() => {
      // Save the original XMLHttpRequest
      const originalXhrOpen = XMLHttpRequest.prototype.open;

      // Override the open method of XMLHttpRequest
      XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        // Check if the request URL matches the specific endpoint
        if (url.includes('/?wc-ajax=wbte_sc_set_block_checkout_values')) {
          this.addEventListener('load', () => {
            // Trigger a cart fetch after the request completes
            heliosLogger("Detected payment method change via XMLHttpRequest, reloading cart...");
            dispatch(setFetchingCart(true));
            fetchCart().then((newCart) => {
              dispatch(setCart(newCart));
              dispatch(setFetchingCart(false));
            });
          });
        }

        // Call the original open method
        return originalXhrOpen.call(this, method, url, ...rest);
      };

      // Cleanup: Restore the original XMLHttpRequest open method
      return () => {
        XMLHttpRequest.prototype.open = originalXhrOpen;
      };
    }, [dispatch]);

    useEffect(() => {
      async function loadCustomer() {
        if (!customer.fetching && valueIsEmpty(customer?.username)) {
          heliosLogger("Loading customer data");
          if (isUserLoggedIn()) {
            heliosLogger("User is logged in, fetching customer data");
            dispatch(setFetchingCustomer(true));
            let customerApiResponse;
            if (isLocal()) {
              customerApiResponse = customerMock;
            } else {
              customerApiResponse = await fetchCustomer(getUserId());
            }
            heliosLogger("Received customer data", customerApiResponse);
            dispatch(updateCustomerFromApiResponse(customerApiResponse));
            dispatch(updateBillingAddressFormFromApiResponse(customerApiResponse));
            dispatch(updateShippingAddressFormFromApiResponse(customerApiResponse));
            dispatch(setFetchingCustomer(false));
          } else {
            heliosLogger("User is not logged in, skipping customer data fetch");
          }
        }
      }
      async function loadOrderForm() {
        const localOrderForm = getOrderFormFromLocalStorage();
        if (localOrderForm) {
          dispatch(updateOrderForm(localOrderForm));
        }
      }
      async function loadProducts() {
        if (products?.fetchingProductsOrVariations) {
          heliosLogger("Fetching products or variations, waiting to proceed");
          return;
        }
        if ((!products || products.length === 0)) {
          if (PRODUCTS_VARIATIONS_CACHE_KEY === localStorage.getItem("productsCacheKey")) {
            heliosLogger("Loading products from cache");
            dispatch(setProducts(JSON.parse(localStorage.getItem("products"))));
            dispatch(setVariations(JSON.parse(localStorage.getItem("variations"))));
          } else {
            dispatch(invalidateProductCache());
            fetchAllProductsAndAllVariations(dispatch);
          }
        }
      }
      async function loadOrder() {
        let orderNumber = getOrderNumber();
        if (isLocal()) {
          if (orderNumber === "452") {
            if (valueIsEmpty(orders.orders[452])) {
              dispatch(updateOrder(order452));
            }
          } else if (!orders.error) {
            dispatch(setOrderError("Error getting order. Redirecting to home page..."));
          }
          return;
        }
        if (orderNumber && !orders.fetching) {
          dispatch(setFetchingOrders(true));
          let order = await fetchOrder(orderNumber);
          if (order) {
            dispatch(updateOrder(order));
          } else {
            dispatch(setOrderError("Error getting order. Redirecting to home page..."));
          }
          dispatch(updateOrder(order));
          dispatch(setFetchingOrders(false));
        }
      }
      async function loadLocalSettings() {
        if (!meta.localSettingsLoaded) {
          const savedTheme = getThemeFromLocalStorage();
          if (savedTheme) {
            dispatch(updateTheme(savedTheme));
          }
          const savedIsBeta = getIsBetaFromLocalStorage();
          if (savedIsBeta) {
            dispatch(setIsBeta(savedIsBeta));
          }
          if (getCheckoutStatusFromLocalStorage()) {
            dispatch(setReadyForCheckout());
          }
          dispatch(setLocalSettingsLoaded(true));
        }
      }
      if (isFirstLoad) {
        heliosLogger("DataLoader rendering");
        loadLocalSettings();
        loadProducts();
        loadOrderForm();
        loadCustomer();
        loadOrder();
        setIsFirstLoad(false);
      }
    }, [customer, dispatch, isFirstLoad, meta, orders, products]);

  return (<StyledDataLoader />);
}

export default DataLoader;