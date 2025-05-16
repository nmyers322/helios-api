import { snakeCaseToCamelCaseAllObjectKeys } from "../modules/serialization";

export const updateOrder = (order) => {
  let jsonStringKeys = ['billingAddress', 'externalOrder', 'pricedCart', 'shippingAddress', 'selectedShippingOption'];
  jsonStringKeys.forEach(name => {
    if (typeof order[name] === "string") {
      order[name] = JSON.parse(order[name]);
    }
  });
  return {
    type: "UPDATE_ORDER",
    payload: {
      ...order
    }
  }
};

export const setFetchingOrders = (fetching) => ({
  type: "SET_FETCHING_ORDERS",
  payload: fetching
});

export const setOrderError = (error) => ({
  type: "SET_ORDER_ERROR",
  payload: error
});