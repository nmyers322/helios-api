import { CUSTOM_FREIGHT_QUOTE_OPTION, IN_STORE_PICKUP_OPTION } from "../modules/shipping";

const localShippingOptions = [
  IN_STORE_PICKUP_OPTION,
  CUSTOM_FREIGHT_QUOTE_OPTION
];
  
const initialState = {
    selectedOption: null,
    shippingOptions: localShippingOptions,
    fetching: false
  };

const shippingOptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_SHIPPING_OPTION":
      return {
          ...state,
          selectedOption: action.payload,
      }
    case "SET_SHIPPING_OPTIONS":
      return {
          ...state,
          shippingOptions: [
            ...action.payload,
            ...localShippingOptions
          ]
      }
    case "SET_FETCHING_SHIPPING_OPTIONS":
      return {
          ...state,
          fetching: action.payload,
      }
    default:
      return state;
  }
};

export default shippingOptionsReducer;
  