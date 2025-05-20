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

export const updateOrders = (orders) => {
  let jsonStringKeys = ['billingAddress', 'externalOrder', 'pricedCart', 'shippingAddress', 'selectedShippingOption'];
  orders.forEach(order => {
    jsonStringKeys.forEach(name => {
      if (typeof order[name] === "string") {
        order[name] = JSON.parse(order[name]);
      }
    });
  });
  return {
    type: "UPDATE_ORDERS",
    payload: orders
  }
}

export const setFetchingOrders = (fetching) => ({
  type: "SET_FETCHING_ORDERS",
  payload: fetching
});

export const setOrderError = (error) => ({
  type: "SET_ORDER_ERROR",
  payload: error
});