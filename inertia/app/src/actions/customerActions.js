import { snakeCaseToCamelCaseAllObjectKeys } from "../modules/serialization";

export const setFetchingCustomer = (fetching) => ({
  type: "SET_FETCHING_CUSTOMER",
  payload: fetching,
});

export const updateCustomerField = (fieldName, value) => ({
  type: "UPDATE_CUSTOMER_FIELD",
  payload: { fieldName, value },
});

export const updateCustomerFromApiResponse = (customer) => {
  customer = customer || {};
  let newCustomer = {};
  if (customer.billing) {
    if (Array.isArray(customer.billing)) {
      newCustomer.billing = customer.billing.map((billingAddress) => snakeCaseToCamelCaseAllObjectKeys(billingAddress));
    } else {
      newCustomer.billing = [snakeCaseToCamelCaseAllObjectKeys(customer.billing)];
    }
  }
  if (customer.shipping) {
    if (Array.isArray(customer.shipping)) {
      newCustomer.shipping = customer.shipping.map((shippingAddress) => snakeCaseToCamelCaseAllObjectKeys(shippingAddress));
    } else {
      newCustomer.shipping = [snakeCaseToCamelCaseAllObjectKeys(customer.shipping)];
    }
  }
  if (customer.first_name) {
    newCustomer.firstName = customer.first_name;
  }
  if (customer.last_name) {
    newCustomer.lastName = customer.last_name;
  }
  if (customer.email) {
    newCustomer.email = customer.email;
  }
  if (customer.username) {
    newCustomer.username = customer.username;
  }

  return {
    type: "UPDATE_CUSTOMER_FROM_API_RESPONSE",
    payload: newCustomer
  };
};