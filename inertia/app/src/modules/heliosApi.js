import axios from 'axios';
import { heliosLogger } from './logging';

const domain = import.meta.env.VITE_REACT_APP_DOMAIN || 'localhost:3333';
const api = axios.create({
  baseURL: domain
});

let fetchingToken = false;
let token = null;

/****************************************************
 * API
 ***************************************************/

const makeCall = async ({
  data, 
  endpoint, 
  method
}) => {
  let headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
      headers['Authorization'] = `Bearer ${token}`;
  }
  let remotePath = `${endpoint}`;
  heliosLogger(`Calling ${method} ${remotePath}`);
  heliosLogger(`Headers:`, headers);
  heliosLogger(`Request data:`, data);
  let response;
  try {
    if (method.toLowerCase() === 'delete') {
      response = await api.delete(remotePath, { headers });
    } else if (method.toLowerCase() === 'get') {
      response = await api.get(remotePath, { headers });
    } else {
      response = await api[method](remotePath, data, { headers });
    }
  } catch (error) {
    heliosLogger(`Error calling ${method} ${endpoint}`, error);
    if (error?.response?.status === 401) {
      heliosLogger(`Token expired, deleting token`);
      token = null;
      if (window.location.pathname !== '/logout' && window.location.pathname !== '/login') {
        window.location.href = '/logout';
      }
    }
    return error;
  }
  heliosLogger(`Response:`, response);
  if (getTokenFromResponse(response)) {
    token = getTokenFromResponse(response);
  }
  return response;
}

const makeDeleteCall = async (endpoint) =>
  makeCall({method: "delete", endpoint});

const makeGetCall = async (endpoint) =>
  makeCall({method: "get", endpoint});

const makePostCall = async (endpoint, data) =>
  makeCall({method: "post", endpoint, data});

const makePutCall = async (endpoint, data) =>
  makeCall({method: "put", endpoint, data});

/****************************************************
 * Auth
 ***************************************************/

export const login = async (email, password) => {
    fetchingToken = true;
    let data = {
        email,
        password
    };
    if (fetchingToken) {
        let response = await makePostCall("/api/session", data);
        fetchingToken = false;
        return response;
    }
    return Promise.reject("Already fetching token");
}

export const logout = async () => {
    let data = await makeCall({
        method: "delete", 
        endpoint: "/api/session"
    });
    return data;
}

export const deleteToken = () =>
    token = null;

export const getTokenFromResponse = (response) =>
  response?.data?.token;

export const hasActiveApiToken = () => 
    !!token;

export const setApiToken = (newToken) => {
    token = newToken;
}

/****************************************************
 * Account
 ****************************************************/

export const createAccount = async (email, password, password2) => {
    let data = {
        email,
        password,
        password2
    };
    let result = await makePostCall("/api/account", data);
    return result;
}

export const getMyAccount = async () => {
    let result = await makeGetCall("/api/account");
    return result;
}

export const updateMyUser = async (data) => {
    let result = await makePutCall("/api/account", data);
    return result;
}

/****************************************************
 * Addresses
 ***************************************************/
export const getMyAddresses = async () => {
    let result = await makeGetCall("/api/account/addresses");
    return result;
}

export const updateAddress = async (data) => {
    let result = await makePutCall(`/api/account/addresses`, data);
    return result;
}

/****************************************************
 * Shipping Options
 ***************************************************/
export const getShippingOptions = async (data) => {
  let result = await makePostCall("/api/shipping-options", data);
  return result;
}

/****************************************************
 * Products
 ***************************************************/

export const fetchAllProducts = async () =>
  makeGetCall("/api/products");

export const fetchProductVariations = async (productId) =>
  makeGetCall(`/api/variations/${productId}`);

/****************************************************
 * Orders
 * ***************************************************/
export const initializeStripeOrder = async (data) =>
  makePostCall("/api/stripe/order", data);

export const initializePaypalOrder = async (data) =>
  makePostCall("/api/paypal/order", data);

export const capturePaypalOrder = async (data) =>
  makePostCall("/api/paypal/capture", data);

export const getOrderById = async (orderId) =>
  makeGetCall(`/api/orders/${orderId}`);

export const getOrders = async () =>
  await makeGetCall("/api/orders");

export const createOrder = async (data) =>
  await makePostCall("/api/orders", data);

/************************************************
 * Admin
 *************************************************/
export const getAllOrdersByStatus = async (status) =>
  await makeGetCall(`/api/orders/status/${status}`);