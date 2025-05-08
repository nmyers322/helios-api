export const calculateShippingCost = (option) => {
    if (option && typeof option.totalCost === "number") {
        return (option.totalCost).toFixed(2);
    }
    return null;
}

export const getSelectedShippingOption = (shippingOptions, selectedOption) => {
    return shippingOptions?.find(option => option.serviceCode === selectedOption) || null;
}

export const IN_STORE_PICKUP_OPTION = {
    serviceCode: "in_store_pickup",
    serviceName: "In Store Pickup",
    shipmentCost: 0,
    otherCost: 0
};

export const CUSTOM_FREIGHT_QUOTE_OPTION = {
    serviceCode: "custom_freight_quote",
    serviceName: "Custom Freight Quote",
    shipmentCost: 0,
    otherCost: 0
};
