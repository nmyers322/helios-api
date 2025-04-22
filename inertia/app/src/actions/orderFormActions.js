export const removeColor = (index) => ({
  type: "REMOVE_COLOR",
  payload: index,
});

export const resetOrderForm = () => ({
  type: "RESET_ORDER_FORM",
});

export const saveLocalOrderForm = (form) => ({
  type: "SAVE_LOCAL_ORDER_FORM",
  payload: form,
});

export const updateColor = (index, color, quantity) => ({
  type: "UPDATE_COLOR",
  payload: { index, color, quantity },
});

export const updateColorQuantity = (index, quantity) => ({
  type: "UPDATE_COLOR_QUANTITY",
  payload: { index, quantity },
});

export const updateOrderFormField = (fieldName, value) => ({
  type: "UPDATE_ORDER_FORM_FIELD",
  payload: { fieldName, value },
});

export const updateOrderForm = (form) => ({
  type: "UPDATE_ORDER_FORM",
  payload: form,
});
