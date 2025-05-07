const initialState = {
    selectedOption: null,
    shippingOptions: [],
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
            shippingOptions: action.payload,
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
  