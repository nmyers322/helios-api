export const logout = () => ({
  type: "LOGOUT",
});

export const saveLocalTheme = (currentTheme) => ({
  type: "SAVE_LOCAL_THEME",
  payload: currentTheme,
});

export const updateTheme = (theme) => ({
  type: "UPDATE_THEME",
  payload: theme,
});

export const setIsBeta = (value) => ({
  type: "SET_BETA",
  payload: value,
});

export const setLocalSettingsLoaded = (value) => ({
  type: "SET_LOCAL_SETTINGS_LOADED",
  payload: value,
});

export const setPrintContent = (value) => ({
  type: "SET_PRINT_CONTENT",
  payload: value,
});

export const setReadyForCheckout = (value = true) => ({
  type: "SET_READY_FOR_CHECKOUT",
  payload: value,
});

export const setShowPrintModal = (value) => ({
  type: "SET_SHOW_PRINT_MODAL",
  payload: value,
});

export const setToken = (token) => ({
  type: "SET_TOKEN",
  payload: token,
});

export const toggleTheme = () => ({
  type: "TOGGLE_THEME"
});