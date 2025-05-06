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

export const updateCustomerDetails = (customer) => {
  customer = customer || {};
  let newCustomer = {};
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
  if (customer.company) {
    newCustomer.company = customer.company;
  }

  return {
    type: "UPDATE_CUSTOMER_FROM_API_RESPONSE",
    payload: newCustomer,
  };
}

export const updateCustomerAddress = (address) => {
  if (address.type === "billing") {
    return {
      type: "UPDATE_CUSTOMER_FROM_API_RESPONSE",
      payload: {
        billing: [snakeCaseToCamelCaseAllObjectKeys(address)]
      }
    }
  } else if (address.type === "shipping") {
    return {
      type: "UPDATE_CUSTOMER_FROM_API_RESPONSE",
      payload: {
        shipping: [snakeCaseToCamelCaseAllObjectKeys(address)]
      }
    }
  }
}

export const updateCustomerFromApiResponse = (customer) => {
  customer = customer || {};
  let newCustomer = {};
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