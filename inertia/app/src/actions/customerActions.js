import { setToken } from "../modules/heliosApi";
import { snakeCaseToCamelCaseAllObjectKeys } from "../modules/serialization";

export const setActiveTokenStatus = (hasActiveToken) => {
  !hasActiveToken && setToken(null);
  return {
    type: "SET_ACTIVE_TOKEN_STATUS",
    payload: hasActiveToken,
  };
};

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
  if (customer.firstName) {
    newCustomer.firstName = customer.firstName;
  }
  if (customer.lastName) {
    newCustomer.lastName = customer.lastName;
  }
  if (customer.email) {
    newCustomer.email = customer.email;
  }
  if (customer.id) {
    newCustomer.id = customer.id;
  }
  if (customer.phone) {
    newCustomer.phone = customer.phone;
  }

  return {
    type: "UPDATE_CUSTOMER_FROM_API_RESPONSE",
    payload: newCustomer
  };
};