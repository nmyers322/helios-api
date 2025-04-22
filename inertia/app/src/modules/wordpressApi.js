import axios from 'axios';
import { userMe } from '../mocks/user-me';
import { getNonce, getUserDetails, isUserLoggedIn } from './authentication';
import { isLocal, isTest } from './environment';
import { products } from '../mocks/products';
import { variation } from '../mocks/variation';
import { heliosLogger } from './logging';
import { cartMock } from '../mocks/cart';

const domain = import.meta.env.VITE_REACT_APP_DOMAIN || 'localhost:3333';
const api = axios.create({
  baseURL: domain
});

let cartToken = null;
let fetchingJwt = false;
let jwt = null;
let wcStoreApiNonce = null;

/****************************************************
 * API
 ***************************************************/

const makeCall = async ({
  data, 
  endpoint, 
  method, 
  unprotected = false,
  woocommerce = false
}) => {
  if (isLocal()) {
    return {};
  }
  heliosLogger(`Making call to ${endpoint}`);
  heliosLogger(`Method: ${method}`);
  heliosLogger(`Data:`, data);
  try {
    const nonce = getNonce();
    let headers = {
      'Content-Type': 'application/json'
    };
    if (woocommerce) {
      headers['Authorization'] = getWCAuthHeaderValue();
    } else {
      if (!jwt && !unprotected) {
        await getJwt();
      }
      if (jwt && !unprotected) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }
    }
    if (cartToken) {
      headers['Cart-Token'] = cartToken;
    }
    if (wcStoreApiNonce) {
      headers['Nonce'] = wcStoreApiNonce;
    }
    let remotePath = `${endpoint}?_wpnonce=${nonce}`;
    heliosLogger(`Calling ${method} ${remotePath}`);
    heliosLogger(`Headers:`, headers);
    heliosLogger(`Request data:`, data);
    let response;
    if (method.toLowerCase() === 'delete') {
      response = await api.delete(remotePath, { headers });
    } else if (method.toLowerCase() === 'get') {
      remotePath += `&per_page=100`;
      response = await api.get(remotePath, { headers });
    } else {
      response = await api[method](remotePath, data, { headers });
    }
    heliosLogger(`Response:`, response);
    if (response?.headers?.['cart-token']) {
      cartToken = response.headers['cart-token'];
      if (isLocal() || isTest()) {
        heliosLogger(`Setting cartToken to ${cartToken}`);
      }
      if (response?.headers?.['nonce']) {
        wcStoreApiNonce = response.headers['nonce'];
        if (isLocal() || isTest()) {
          heliosLogger(`Setting wcStoreApiNonce to ${wcStoreApiNonce}`);
        }
      }
    }
    // Here check if response is ok and do error handling
    return response.data;
  } catch (error) {
    heliosLogger(`Error calling ${method} ${endpoint}`, error);
  }
}

const makeDeleteCall = async (endpoint) =>
  makeCall({method: "delete", endpoint});

const makeGetCall = async (endpoint) =>
  makeCall({method: "get", endpoint});

const makePostCall = async (endpoint, data) =>
  makeCall({method: "post", endpoint, data});

const makePutCall = async (endpoint, data) =>
  makeCall({method: "put", endpoint, data});

export const batchPost = async (requests) => 
  makePostCall("/wp-json/batch/v1", { requests });

/****************************************************
 * Auth
 ***************************************************/

const convertSessionToJwt = async () => {
  if (isLocal() || !isUserLoggedIn()) {
    jwt = "jwt";
  }
  if (jwt) {
    return jwt;
  }
  fetchingJwt = true;
  let data = await makeCall({
    method: "post", 
    endpoint: "/wp-json/custom/v1/convert-session-to-jwt", 
    unprotected: true
  });
  // Handle unauthorized and log user out
  if (data?.token) {
    jwt = data.token;
  }
  fetchingJwt = false;
  return jwt;
}

export const getWCAuthHeaderValue = () => 
  `Basic ${btoa(`${import.meta.env.VITE_REACT_APP_READONLY_CONSUMER_KEY}:${import.meta.env.VITE_REACT_APP_READONLY_CONSUMER_SECRET}`)}`;

export const getJwt = async () => {
  let runningTime = 0;
  let timeout = 10000;
  if (fetchingJwt) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (jwt) {
          clearInterval(interval);
          resolve(jwt);
        }
        runningTime += 100;
        if (runningTime >= timeout) {
          clearInterval(interval);
          resolve(null);
        }
      }, 100);
    });
  }
  await convertSessionToJwt();
  return jwt;
}

/****************************************************
 * Cart
 ***************************************************/

export const addToCart = async (productId, quantity, variation) => {
  let data = {
    id: productId,
    quantity
  }
  if (variation) {
    data.variation = variation;
  }
  return makePostCall("/wp-json/wc/store/v1/cart/add-item", data);
}

export const addToCartBatch = async (items) => {
  const requests = items.map(item => ({
    path: "/wc/store/v1/cart/add-item",
    method: "POST",
    cache: "no-store",
    body: item,
    headers: {
      Nonce: wcStoreApiNonce
    }
  }));
  return makePostCall("/wp-json/wc/store/v1/batch", { requests });
}

export const deleteAllCartItems = async () =>
  makeDeleteCall("/wp-json/wc/store/v1/cart/items");

export const fetchCart = async () =>
  isLocal() ? cartMock : makeGetCall("/wp-json/wc/store/v1/cart");

export const removeFromCart = async (key) => {
  return makePostCall("/wp-json/wc/store/v1/cart/remove-item", { key });
}

/****************************************************
 * Products
 ***************************************************/

export const fetchAllProducts = async () =>
  isLocal() ? products : makeCall({
    endpoint: "/wp-json/wc/v3/products", 
    method: "get",
    woocommerce: true
  });

export const fetchProduct = async (productId) =>
  isLocal() ? {} : makeCall({
    endpoint: `/wp-json/wc/v3/products/${productId}`, 
    method: "get",
    woocommerce: true
  });

export const fetchProductVariations = async (productId) =>
  isLocal() ? variation : makeCall({
    endpoint: `/wp-json/wc/v3/products/${productId}/variations`, 
    method: "get",
    woocommerce: true
  });

/****************************************************
 * User
 ***************************************************/

export const fetchCustomer = async (id) =>
  makeGetCall(`/wp-json/wc/v3/customers/${id}`);

export const fetchMyUser = async () => {
  if (isLocal()) {
    return userMe;
  }
  return makeGetCall("/wp-json/wp/v2/users/me");
}

export const logInLink = import.meta.env.VITE_REACT_APP_DOMAIN + "/wp-login.php";
export const logOutLink = () => `${domain}/wp-login.php?action=logout&_wpnonce=${getNonce()}`;

export const updateMyUser = async (data) => {
  return makePostCall("/wp-json/wp/v2/users/me", data);
}

export const updateCustomer = async (data) => {
  let userDetails = getUserDetails();
  if (!userDetails) {
    return Promise.reject("User details not found");
  }
  return makePutCall(`/wp-json/wc/v3/customers/${userDetails.ID}`, data);
}

/****************************************************
 * Orders
 * ***************************************************/

export const fetchOrder = async (orderId) =>
  makeGetCall(`/wp-json/wc/v3/orders/${orderId}`);