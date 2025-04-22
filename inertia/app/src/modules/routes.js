export const getOrderStep = () => {
    const parts = getPathParts();
    if (parts.length === 1 && parts[0] === "order") {
        return "album-details";
    }
    return parts[1];
}

export const getPathParts = (uri = window.location.pathname) => uri.split("/").filter(s => s !== '');

export const onCheckoutPage = () => getPathParts().length === 1 && getPathParts()[0] === "checkout";

export const onContactPage = () => getPathParts().length === 1 && getPathParts()[0] === "contact-us";

export const onLandingPage = () => window.location.pathname === "/";

export const onInformationPage = () => {
    if (getPathParts().length !== 1) {
        return false;
    }
    const location = getPathParts()[0];
    return location === "mastering" 
        || location === "returns"
        || location === "privacy"
        || location === "templates"
        || location === "terms"
        || location === "thanks";
}

export const onOrderReceivedPage = () => getPathParts().slice(0, 2).join("/") === "checkout/order-received";

export const onOrderRootPage = () => getPathParts().length === 1 && getPathParts()[0] === "order";

export const onOrderSummaryPage = () => getOrderStep() === "summary";

export const onAnyOrderPage = () => getPathParts()[0] === "order";

export const onWCPage = () => onCheckoutPage() || onOrderReceivedPage();