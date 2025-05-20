import { heliosLogger } from "../modules/logging";

const initialState = {
  error: null,
  fetching: false,
  orders: {}
};
  
  const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
      case "RESET_ORDERS":
        return initialState;
      case "SET_FETCHING_ORDERS":
        return {
          ...state,
          fetching: action.payload,
        };
      case "SET_ORDER_ERROR":
        return {
          ...state,
          error: action.payload,
        };
      case "UPDATE_ORDER":
        heliosLogger("Updating order:", action.payload);
        return {
          ...state,
          orders: {
            ...state.orders,
            [action.payload.id]: action.payload
          }
        };
      case "UPDATE_ORDERS":
        heliosLogger("Updating orders:", action.payload);
        let orders = {...state.orders};
        action.payload.forEach(order => {
          orders[order.id] = order;
        });
        return {
          ...state,
          orders: orders
        };
      default:
        return state;
    }
  };
  
  export default ordersReducer;
  