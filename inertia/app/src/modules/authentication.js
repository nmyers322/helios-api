import { reactPress } from "../mocks/reactPress"
import { isLocal } from "./environment";

export const isUserAdmin = () =>
    // Not yet implemented
    false;

export const isUserLoggedIn = () =>
    getEnvAwareReactPress()?.user?.data?.user_login;

const getEnvAwareReactPress = () =>
    isLocal() ? reactPress : window.reactPress;

export const getNonce = () =>
    getEnvAwareReactPress()?.api?.nonce;

export const getUserDetails = () =>
    isUserLoggedIn() ? getEnvAwareReactPress()?.user?.data : null;

export const getUserId = () =>
    getUserDetails()?.ID;