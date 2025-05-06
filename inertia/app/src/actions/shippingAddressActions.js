import { address1Name } from "../components/form/account/Address1";
import { address2Name } from "../components/form/account/Address2";
import { cityName } from "../components/form/account/City";
import { countryName } from "../components/form/account/Country";
import { firstNameName } from "../components/form/account/FirstName";
import { lastNameName } from "../components/form/account/LastName";
import { postcodeName } from "../components/form/account/Postcode";
import { stateName } from "../components/form/account/State";
import { convertGooglePlaceToAddress } from "../modules/googleMaps";
import { snakeCaseToCamelCaseAllObjectKeys } from "../modules/serialization";

export const buildShippingAddressFromBillingAddress = (billingAddress) => {
  let newShippingAddress = {
    ...billingAddress,
  };
  delete newShippingAddress.phone;
  delete newShippingAddress.company;
  return newShippingAddress;
};

export const buildShippingAddressFromForm = (shippingAddressForm) => {
  return {
    address1: shippingAddressForm[address1Name],
    address2: shippingAddressForm[address2Name],
    city: shippingAddressForm[cityName],
    country: shippingAddressForm[countryName],
    firstName: shippingAddressForm[firstNameName],
    lastName: shippingAddressForm[lastNameName],
    postcode: shippingAddressForm[postcodeName],
    state: shippingAddressForm[stateName]
  };
};

export const updateShippingAddressFormField = (fieldName, value) => ({
  type: "UPDATE_SHIPPING_ADDRESS_FORM_FIELD",
  payload: { fieldName, value },
});

export const updateShippingAddressForm = (value) => ({
  type: "UPDATE_SHIPPING_ADDRESS_FORM",
  payload: value,
});

export const updateShippingAddressFormFromApiResponse = (address) => {
  return {
    type: "UPDATE_SHIPPING_ADDRESS_FORM_FROM_API_RESPONSE",
    payload: snakeCaseToCamelCaseAllObjectKeys(address)
  };
};

export const updateShippingAddressFormFromGoogleMaps = (place) => {
  return {
    type: "UPDATE_SHIPPING_ADDRESS_FORM_FROM_API_RESPONSE",
    payload: convertGooglePlaceToAddress(place)
  };
};