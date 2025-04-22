const initialState = {
    address1: "",
    address2: "",
    city: "",
    company: "",
    country: "",
    firstName: "",
    lastName: "",
    postcode: "",
    state: ""
  };
  
  const shippingAddressFormReducer = (state = initialState, action) => {
    switch (action.type) {
      case "RESET_ORDER_FORM":
        return initialState;
      case "UPDATE_SHIPPING_ADDRESS_FORM":
        if (!action.payload) {
          return state;
        }
        return {
          ...state,
          ...action.payload,
        };
      case "UPDATE_SHIPPING_ADDRESS_FORM_FIELD":
        return {
          ...state,
          [action.payload.fieldName]: action.payload.value,
        };
      case "UPDATE_SHIPPING_ADDRESS_FORM_FROM_API_RESPONSE":
        return {
          ...state,
          ...action.payload
        }
      default:
        return state;
    }
  };
  
  export default shippingAddressFormReducer;
  