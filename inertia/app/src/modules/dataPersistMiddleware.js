import { PRODUCTS_VARIATIONS_CACHE_KEY } from "../components/main/App";

export const orderFormPersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === "SAVE_LOCAL_ORDER_FORM") {
    const state = store.getState();
    localStorage.setItem("orderForm", JSON.stringify(state.orderForm));
  }
  if (action.type === "SET_READY_FOR_CHECKOUT") {
    localStorage.setItem("readyForCheckout", JSON.stringify(action.payload));
  }
  return result;
};

export const themePersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === "SAVE_LOCAL_THEME") {
    const state = store.getState();
    localStorage.setItem("currentTheme", JSON.stringify(state.meta.currentTheme));
  }
  if (action.type === "SET_BETA") {
    localStorage.setItem("isBeta", JSON.stringify(action.payload));
  }
  return result;
};

export const productsAndVariationsPersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === "SET_PRODUCTS") {
    const state = store.getState();
    localStorage.setItem("productsCacheKey", PRODUCTS_VARIATIONS_CACHE_KEY);
    localStorage.setItem("products", JSON.stringify(state.products.products));
  } else if (action.type === "SET_PRODUCT_VARIATIONS") {
    const state = store.getState();
    localStorage.setItem("variations", JSON.stringify(state.products.variations));
  } else if (action.type === "INVALIDATE_PRODUCT_CACHE") {
    localStorage.removeItem("productsCacheKey");
    localStorage.removeItem("products");
    localStorage.removeItem("variations");
  }
  return result;
};

export const getCheckoutStatusFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("readyForCheckout"));
};

export const getIsBetaFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("isBeta"));
};

export const getThemeFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("currentTheme"));
};

export const getOrderFormFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("orderForm"));
};
