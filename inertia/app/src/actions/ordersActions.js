import { snakeCaseToCamelCaseAllObjectKeys } from "../modules/serialization";

export const updateOrder = (order) => {
  if (typeof order?.pricedCart === "string") {
    order.pricedCart = JSON.parse(order.pricedCart);
  }
  function jsonify(name) {
    if (typeof order[name] === "string") {
      order[name] = JSON.parse(order[name]);
    }
  }
  ['billingAddress', 'externalOrder', 'pricedCart', 'shippingAddress', 'selectedShippingOption'].forEach(jsonify);
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