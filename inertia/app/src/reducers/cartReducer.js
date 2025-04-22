const initialState = {
  cart: {},
  fetching: false
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_SHIPPING_RATE":
      return {
        ...state,
        cart: {
          ...state.cart,
          shipping_rates: [
            {
              ...state.cart.shipping_rates?.at(0),
              shipping_rates: state.cart?.shipping_rates?.at(0)?.shipping_rates?.map((rate) => {
                if (rate.rate_id === action.payload) {
                  return {
                    ...rate,
                    selected: true
                  };
                } else {
                  return {
                    ...rate,
                    selected: false
                  };
                }
              })
            }
          ],
          totals: {
            ...state.cart.totals,
            total_shipping: state.cart?.shipping_rates?.at(0)?.shipping_rates?.find((rate) => rate.rate_id === action.payload)?.price,
            total_price: (parseInt(state.cart?.totals?.total_items) + parseInt(state.cart?.shipping_rates?.at(0)?.shipping_rates?.find((rate) => rate.rate_id === action.payload)?.price))?.toString()
          }
        }
      };
    case "SET_CART":
      return {
        ...state,
        cart: action.payload
      };
    case "SET_FETCHING_CART":
      return {
        ...state,
        fetching: action.payload
      };
    default:
      return state;
  }
};

export default cartReducer;
