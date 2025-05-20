import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { heliosLogger } from "../../modules/logging.js";
import { setActiveTokenStatus, setFetchingCustomer, updateCustomerFromApiResponse } from "../../actions/customerActions.js";
import { getCheckoutStatusFromLocalStorage, getIsBetaFromLocalStorage, getOrderFormFromLocalStorage, getThemeFromLocalStorage, getTokenFromLocalStorage } from "../../modules/dataPersistMiddleware.js";
import { updateOrderForm } from "../../actions/orderFormActions.js";
import { fetchAllProductsAndAllVariations, invalidateProductCache, setProducts, setVariations } from "../../actions/productsActions.js";
import { setIsBeta, setLocalSettingsLoaded, setLocalToken, setReadyForCheckout, updateTheme } from "../../actions/metaActions.js";
import { PRODUCTS_VARIATIONS_CACHE_KEY } from "./App.js";
import { valueIsEmpty } from "../../modules/validation.js";
import { getMyAccount, hasActiveApiToken, setApiToken } from "../../modules/heliosApi.js";


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
      
      async function loadLocalToken() {
        // Injecting Google token from Inertia
        let possibleToken = props?.props?.initialPage?.props?.auth?.token;
        if (possibleToken && !hasActiveApiToken()) {
          heliosLogger("Loading token from page props");
          setApiToken(possibleToken);
          dispatch(setActiveTokenStatus(true));
          dispatch(setLocalToken(possibleToken));
        } else if (!hasActiveApiToken()) {
          const token = getTokenFromLocalStorage();
          if (token) {
            heliosLogger("Loading token from local storage");
            setApiToken(token);
            dispatch(setActiveTokenStatus(true));
          }
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

          const localOrderForm = getOrderFormFromLocalStorage();
          if (localOrderForm) {
            dispatch(updateOrderForm(localOrderForm));
          }

          if (getCheckoutStatusFromLocalStorage()) {
            dispatch(setReadyForCheckout());
          }

          dispatch(setLocalSettingsLoaded(true));
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

      if (isFirstLoad) {
        heliosLogger("DataLoader rendering");
        loadLocalToken();
        loadLocalSettings();
        loadProducts();
        setIsFirstLoad(false);
      }
    }, [dispatch, isFirstLoad, meta, orders, products]);

    useEffect(() => {

      async function loadCustomer() {
        if (!customer.fetching && customer.hasActiveToken && valueIsEmpty(customer.id)) {
          heliosLogger("Loading customer data");
          dispatch(setFetchingCustomer(true));
          let user = await getMyAccount();
          if (user?.status === 200 && !valueIsEmpty(user?.data)) {
            dispatch(updateCustomerFromApiResponse(user?.data));
          } else {
            heliosLogger("Error loading customer data", user);
            dispatch(setActiveTokenStatus(false));
            dispatch(setFetchingCustomer(false));
            dispatch(setLocalToken(null));
          }
          dispatch(setFetchingCustomer(false));
        }
      }

      if (customer?.hasActiveToken && !customer?.fetching) {
        loadCustomer();
      }
    }, [customer, dispatch]);

  return (<StyledDataLoader />);
}

export default DataLoader;