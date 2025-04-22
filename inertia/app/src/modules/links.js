import { heliosLogger } from "./logging";
import { getPathParts, onWCPage } from "./routes";

export const HARD_LINKS = [
    "contact-us",
    "checkout"
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

export const goTo = (navigate, uri) => {
    if (onWCPage() || isHardLink(uri)) {
        heliosLogger("Hard loading " + uri);
        window.location.href = uri;
    } else {
        heliosLogger("Navigating to " + uri);
        navigate(uri);
        window.scrollTo(0, 0);
    }
}

export const useGoTo = (navigate) => {
    return (uri) => goTo(navigate, uri);
}