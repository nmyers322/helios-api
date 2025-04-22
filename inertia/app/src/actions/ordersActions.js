import { snakeCaseToCamelCaseAllObjectKeys } from "../modules/serialization";

export const updateOrder = (order) => ({
  type: "UPDATE_ORDER",
  payload: {
    ...order,
    billing: snakeCaseToCamelCaseAllObjectKeys(order?.billing),
    shipping: snakeCaseToCamelCaseAllObjectKeys(order?.shipping),
  }
});

export const setFetchingOrders = (fetching) => ({
  type: "SET_FETCHING_ORDERS",
  payload: fetching
});

export const setOrderError = (error) => ({
  type: "SET_ORDER_ERROR",
  payload: error
});