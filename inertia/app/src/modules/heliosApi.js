
/*
curl -v -X DELETE http://localhost:3333/api/session -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer oat_Mg.RVRMMEY4d0NfU09qcHRrVmdsNEx6N0kwN2VDR3lPSTdSWUxVNTYtTjIxOTEyNDI5NA'
curl -v -X POST http://localhost:3333/api/session -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{"email": "nmyers322@gmail.com", "password": "password"}'
*/


import axios from 'axios';
import { userMe } from '../mocks/user-me';
import { getUserDetails } from './authorization';
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

export const hasActiveToken = () => 
    !!token;

export const setToken = (newToken) => {
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
 * Products
 ***************************************************/

export const fetchAllProducts = async () =>
  makeGetCall("/api/products");

export const fetchProductVariations = async (productId) =>
  makeGetCall(`/api/variations/${productId}`);

/****************************************************
 * Orders
 * ***************************************************/

