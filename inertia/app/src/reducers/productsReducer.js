import { heliosLogger } from "../modules/logging";

const initialState = {
  details: {},
  fetchingProductsOrVariations: false,
  products: [],
  variations: {}
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCHING_PRODUCTS_OR_VARIATIONS":
      return {
        ...state,
        fetchingProductsOrVariations: action.payload
      };
    case "SET_PRODUCTS":
      heliosLogger("Setting products:", action.payload);
      return {
        ...state,
        products: action.payload
      };
    case "SET_PRODUCT":
      return {
        ...state,
        details: {
          ...state.details,
          [action.payload.productId]: action.payload.product
        }
      };
    case "SET_PRODUCT_VARIATIONS":
      heliosLogger("Setting variations for product:", action.payload.productId);
      return {
        ...state,
        variations: {
          ...state.variations,
          [action.payload.productId]: action.payload.variations
        }
      };
    case "SET_VARIATIONS":
      heliosLogger("Setting variations:", action.payload);
      return {
        ...state,
        variations: action.payload
      };
    default:
      return state;
  }
};

export default productsReducer;
