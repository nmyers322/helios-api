import { configureStore } from '@reduxjs/toolkit';
import orderFormReducer from './orderFormReducer';
import productsReducer from './productsReducer';
import { orderFormPersistMiddleware, productsAndVariationsPersistMiddleware, sessionPersistMiddleware, themePersistMiddleware } from "../modules/dataPersistMiddleware";
import metaReducer from './metaReducer';
import billingAddressFormReducer from './billingAddressFormReducer';
import customerReducer from './customerReducer';
import shippingAddressFormReducer from './shippingAddressFormReducer';
import shippingOptionsReducer from './shippingOptionsReducer';
import ordersReducer from './ordersReducer';
import cartReducer from './cartReducer';

const store = configureStore({
  reducer: {
    billingAddressForm: billingAddressFormReducer,
    cart: cartReducer,
    customer: customerReducer,
    meta: metaReducer,
    orderForm: orderFormReducer,
    orders: ordersReducer,
    products: productsReducer,
    shippingAddressForm: shippingAddressFormReducer,
    shippingOptions: shippingOptionsReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(orderFormPersistMiddleware)
      .concat(sessionPersistMiddleware)
      .concat(themePersistMiddleware)
      .concat(productsAndVariationsPersistMiddleware),
});

export default store;