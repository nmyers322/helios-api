import { reactPress } from "../mocks/reactPress"
import { isLocal } from "./environment";
import { hasActiveToken } from "./heliosApi";

export const isUserAdmin = () =>
    // Not yet implemented
    false;

export const isUserLoggedIn = () =>
    hasActiveToken();

const getEnvAwareReactPress = () =>
    isLocal() ? reactPress : window.reactPress;

export const getNonce = () =>
    getEnvAwareReactPress()?.api?.nonce;

export const getUserDetails = () =>
    isUserLoggedIn() ? getEnvAwareReactPress()?.user?.data : null;

export const getUserId = () =>
    getUserDetails()?.ID;