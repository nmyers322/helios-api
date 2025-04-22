import { heliosLogger } from "../modules/logging";

const initialState = {
    billing: [],
    email: "",
    fetching: false,
    firstName: "",
    lastName: "",
    shipping: [],
    username: ""
  };
  
  const customerReducer = (state = initialState, action) => {
    switch (action.type) {
      case "RESET_CUSTOMER":
        return initialState;
      case "SET_FETCHING_CUSTOMER":
        return {
          ...state,
          fetching: action.payload,
        };
      case "UPDATE_CUSTOMER_FIELD":
        return {
          ...state,
          [action.payload.fieldName]: action.payload.value,
        };
      case "UPDATE_CUSTOMER_FROM_API_RESPONSE":
        heliosLogger("Updating customer from API response:", action.payload);
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };
  
  export default customerReducer;
  