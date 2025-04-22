const initialState = {
    address1: "",
    address2: "",
    city: "",
    company: "",
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    postcode: "",
    state: ""
  };
  
  const billingAddressFormReducer = (state = initialState, action) => {
    switch (action.type) {
      case "RESET_ORDER_FORM":
        return initialState;
      case "UPDATE_BILLING_ADDRESS_FORM":
        if (!action.payload) {
          return state;
        }
        return {
          ...state,
          ...action.payload,
        };
      case "UPDATE_BILLING_ADDRESS_FORM_FIELD":
        return {
          ...state,
          [action.payload.fieldName]: action.payload.value,
        };
        case "UPDATE_BILLING_ADDRESS_FORM_FROM_API_RESPONSE":
          return {
            ...state,
            ...action.payload
          }
      default:
        return state;
    }
  };
  
  export default billingAddressFormReducer;
  