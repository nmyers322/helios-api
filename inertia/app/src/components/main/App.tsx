import { BrowserRouter } from "react-router-dom";
import store from "../../reducers/store.js";
import { Provider } from "react-redux";
import ThemedApp from "./ThemedApp.jsx";
import DataLoader from "./DataLoader.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Update this to force a cache clear
export const PRODUCTS_VARIATIONS_CACHE_KEY = "736f1222-e200-47ae-af09-66eb65d80308";

const PAYPAL_OPTIONS = {
  clientId: import.meta.env.VITE_REACT_APP_PAYPAL_CLIENT_ID,
  components: "buttons",
  disableFunding: "card"
};

const App = (props: any) => (
  <Provider store={store}>
    <PayPalScriptProvider options={PAYPAL_OPTIONS}>
      <DataLoader props={props} />
      <BrowserRouter>
        <ThemedApp props={props} />
      </BrowserRouter>
    </PayPalScriptProvider>
  </Provider>
)

export default App;
