
/*
curl -v -X DELETE http://localhost:3333/api/session -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer oat_Mg.RVRMMEY4d0NfU09qcHRrVmdsNEx6N0kwN2VDR3lPSTdSWUxVNTYtTjIxOTEyNDI5NA'
curl -v -X POST http://localhost:3333/api/session -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{"email": "nmyers322@gmail.com", "password": "password"}'
*/


import axios from 'axios';
import { userMe } from '../mocks/user-me';
import { getNonce, getUserDetails, isUserLoggedIn } from './authorization';
import { isLocal } from './environment';
import { products } from '../mocks/products';
import { variation } from '../mocks/variation';
import { heliosLogger } from './logging';
import { cartMock } from '../mocks/cart';

const domain = import.meta.env.VITE_REACT_APP_DOMAIN || 'localhost:3333';
const api = axios.create({
  baseURL: domain
});

let fetchingToken = false;
let token = null;
let wcStoreApiNonce = null;

/****************************************************
 * API
 ***************************************************/

const makeCall = async ({
  data, 
  endpoint, 
  method
}) => {
  heliosLogger(`Making call to ${endpoint}`);
  heliosLogger(`Method: ${method}`);
  heliosLogger(`Data:`, data);
  try {
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
    if (method.toLowerCase() === 'delete') {
      response = await api.delete(remotePath, { headers });
    } else if (method.toLowerCase() === 'get') {
      response = await api.get(remotePath, { headers });
    } else {
      response = await api[method](remotePath, data, { headers });
    }
    heliosLogger(`Response:`, response);
    if (response?.data?.token) {
      token = response.data.token;
    }
    return response;
  } catch (error) {
    heliosLogger(`Error calling ${method} ${endpoint}`, error);
    return error;
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

export const hasActiveToken = () => 
    !!token;

export const deleteToken = () =>
    token = null;

/****************************************************
 * Account
 ****************************************************/

export const createAccount = async (email, password, password2) => {
    let data = {
        email,
        password,
        password2
    };
    let response = await makePostCall("/api/account", data);
    return response;
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



