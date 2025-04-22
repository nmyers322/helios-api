import React from "react";
import { BrowserRouter } from "react-router-dom";
import store from "../../reducers/store.js";
import { Provider } from "react-redux";
import ThemedApp from "./ThemedApp.jsx";
import DataLoader from "./DataLoader.jsx";

// Update this to force a cache clear
export const PRODUCTS_VARIATIONS_CACHE_KEY = "936f1222-e200-47ae-af09-66eb65d80307";

const App = (props: any) => (
  <Provider store={store}>
    <DataLoader props={props} />
    <BrowserRouter>
      <ThemedApp props={props} />
    </BrowserRouter>
  </Provider>
)

export default App;
