import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { heliosLogger } from "../../modules/logging.js";
import { setActiveTokenStatus, setFetchingCustomer, updateCustomerFromApiResponse } from "../../actions/customerActions.js";
import { fetchCustomer, fetchOrder } from "../../modules/wordpressApi.js";
import { updateBillingAddressFormFromApiResponse } from "../../actions/billingAddressActions.js";
import { updateShippingAddressFormFromApiResponse } from "../../actions/shippingAddressActions.js";
import { getCheckoutStatusFromLocalStorage, getIsBetaFromLocalStorage, getOrderFormFromLocalStorage, getThemeFromLocalStorage, getTokenFromLocalStorage } from "../../modules/dataPersistMiddleware.js";
import { updateOrderForm } from "../../actions/orderFormActions.js";
import { fetchAllProductsAndAllVariations, invalidateProductCache, setProducts, setVariations } from "../../actions/productsActions.js";
import { setFetchingOrders, setOrderError, updateOrder } from "../../actions/ordersActions.js";
import { getOrderNumber } from "../../modules/orders.js";
import { setIsBeta, setLocalSettingsLoaded, setReadyForCheckout, updateTheme } from "../../actions/metaActions.js";
import { isLocal } from "../../modules/environment.js";
import { PRODUCTS_VARIATIONS_CACHE_KEY } from "./App.js";
import { valueIsEmpty } from "../../modules/validation.js";
import { customerMock } from "../../mocks/customer.js";
import { getMyAccount, hasActiveToken, setToken } from "../../modules/heliosApi.js";

const StyledDataLoader = styled.div`
    display: none;
`;

const DataLoader = (props) => {

    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);
    const customer = useSelector((state) => state.customer);
    const orders = useSelector((state) => state.orders);
    const meta = useSelector((state) => state.meta);

    useEffect(() => {
      async function loadCustomer() {
        if (!customer.fetching && !customer.hasActiveToken && hasActiveToken()) {
          heliosLogger("Loading customer data");
          dispatch(setFetchingCustomer(true));
          let result = await getMyAccount();
          if (result?.status === 200 && !valueIsEmpty(result?.data)) {
            dispatch(setActiveTokenStatus(true));
            dispatch(updateCustomerFromApiResponse(result?.data));
            dispatch(updateBillingAddressFormFromApiResponse(result?.data));
            dispatch(updateShippingAddressFormFromApiResponse(result?.data));
          } else {
            dispatch(setActiveTokenStatus(false));
          }
          dispatch(setFetchingCustomer(false));
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
          heliosLogger("Loading local settings");
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
      function loadLocalToken() {
        if (!hasActiveToken()) {
          const token = getTokenFromLocalStorage();
          if (token) {
            setToken(token);
          }
        }
      }
      if (isFirstLoad) {
        heliosLogger("DataLoader rendering");
        loadLocalToken();
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