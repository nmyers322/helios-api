export const selectShippingRate = (rateId) => {
  return {
    type: "SELECT_SHIPPING_RATE",
    payload: rateId
  };
}

export const setCart = (cart) => {
  return {
    type: "SET_CART",
    payload: cart
  };
}

export const setFetchingCart = (fetching) => {
  return {
    type: "SET_FETCHING_CART",
    payload: fetching
  };
}