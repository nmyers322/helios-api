export const setShippingOptions = (shippingOptions) => ({
  type: "SET_SHIPPING_OPTIONS",
  payload: shippingOptions,
});

export const setFetchingShippingOptions = (fetching) => ({
  type: "SET_FETCHING_SHIPPING_OPTIONS",
  payload: fetching,
});

export const selectShippingOption = (shippingOption) => ({
  type: "SELECT_SHIPPING_OPTION",
  payload: shippingOption,
});
