import { useNavigate } from "react-router-dom";
import { getMyAccount, hasActiveApiToken } from "./heliosApi";
import { goTo } from "./links";

export const isUserAdmin = () =>
    // Not yet implemented
    false;

export const isUserLoggedIn = () =>
    hasActiveApiToken();

export const getNonce = () =>
    null;

export const getUserDetails = async () => {
    if (isUserLoggedIn()) {
        let result = await getMyAccount();
        if (result?.status === 401) {
            goTo(useNavigate(), "/logout");
            return null;
        }
        if (result?.status === 200) {
            return result?.data;
        }
    }
    return null;
}

export const getUserId = async () =>
    await getUserDetails()?.id;