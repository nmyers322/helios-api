import { heliosLogger } from "./logging";
import { getPathParts } from "./routes";

export const HARD_LINKS = [

]

export const hardLoad = (url) => {
    window.location.href = url;
}

export const isHardLink = (uri) => {
    const parts = getPathParts(uri);
    return HARD_LINKS.map(s => getPathParts(s)).find(hardParts => { 
        return parts.length === hardParts.length && parts.every((part, i) => part === hardParts[i]);
    }) !== undefined;
}

export const getQueryParamsObject = () => {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
};

export const buildQueryString = (queryParams) => {
    return new URLSearchParams(queryParams).toString();
};

export const goTo = (navigate, uri, queryParams = null) => {
    let finalUri = uri;

    if (queryParams) {
        const queryString = buildQueryString(queryParams);
        finalUri = `${uri}${queryString ? "?" + queryString : ""}`;
    } else {
        const currentQueryParams = getQueryParamsObject();
        const queryParamsToForward = ["redirect"];
        const newQueryParams = Object.keys(currentQueryParams)
            .filter(key => queryParamsToForward.includes(key))
            .reduce((obj, key) => {
                obj[key] = currentQueryParams[key];
                return obj;
            }, {});
        const queryString = buildQueryString(newQueryParams);
        if (queryString) {
            finalUri = `${uri}?${queryString}`;
        }
    }
    heliosLogger("Navigating to " + finalUri);

    if (isHardLink(uri)) {
        window.location.href = finalUri;
    } else {
        navigate(finalUri);
        window.scrollTo(0, 0);
    }
}

export const useGoTo = (navigate) => {
    return (uri, queryParams) => goTo(navigate, uri, queryParams);
}

export const handlePossiblRedirect = (navigate, uri) => {
    const queryParams = getQueryParamsObject();
    if (queryParams?.redirect) {
        goTo(navigate, queryParams.redirect, {});
    } else {
        goTo(navigate, uri, {});
    }
}