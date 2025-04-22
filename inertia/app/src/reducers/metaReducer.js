import { isLocal, isTest } from "../modules/environment";
import { heliosLogger } from "../modules/logging";

const initialState = {
  currentTheme: "light",
  isBeta: isLocal() || isTest(),
  localSettingsLoaded: false,
  printContent: "",
  readyForCheckout: false,
  showPrintModal: false,
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark-mode');
  } else {
    root.classList.remove('dark-mode');
  }
};

const metaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BETA":
      return {
        ...state,
        isBeta: action.payload
      };
    case "SET_LOCAL_SETTINGS_LOADED":
      return {
        ...state,
        localSettingsLoaded: action.payload
      };
    case "SET_PRINT_CONTENT":
      return {
        ...state,
        printContent: action.payload
      };
    case "SET_READY_FOR_CHECKOUT":
      if (action.payload) {
        heliosLogger("Ready for checkout");
      } else {
        heliosLogger("Not ready for checkout");
      }
      return {
        ...state,
        readyForCheckout: action.payload
      };
    case "SET_SHOW_PRINT_MODAL":
      return {
        ...state,
        showPrintModal: action.payload
      };
    case "TOGGLE_THEME":
      const newTheme = state.currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme);
      return {
        ...state,
        currentTheme: newTheme
      };
    case "UPDATE_THEME":
      applyTheme(action.payload);
      return {
        ...state,
        currentTheme: action.payload,
      };
    default:
      return state;
  }
};

export default metaReducer;
