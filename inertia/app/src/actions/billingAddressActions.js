import { address1Name } from "../components/form/account/Address1";
import { address2Name } from "../components/form/account/Address2";
import { cityName } from "../components/form/account/City";
import { companyName } from "../components/form/account/Company";
import { countryName } from "../components/form/account/Country";
import { firstNameName } from "../components/form/account/FirstName";
import { lastNameName } from "../components/form/account/LastName";
import { phoneName } from "../components/form/account/Phone";
import { postcodeName } from "../components/form/account/Postcode";
import { stateName } from "../components/form/account/State";
import { convertGooglePlaceToAddress } from "../modules/googleMaps";
import { snakeCaseToCamelCaseAllObjectKeys } from "../modules/serialization";

export const buildBillingAddressFromForm = (billingAddressForm) => {
  return {
    address1: billingAddressForm[address1Name],
    address2: billingAddressForm[address2Name],
    city: billingAddressForm[cityName],
    company: billingAddressForm[companyName],
    country: billingAddressForm[countryName],
    firstName: billingAddressForm[firstNameName],
    lastName: billingAddressForm[lastNameName],
    phone: billingAddressForm[phoneName],
    postcode: billingAddressForm[postcodeName],
    state: billingAddressForm[stateName]
  };
};

export const updateBillingAddressFormField = (fieldName, value) => ({
  type: "UPDATE_BILLING_ADDRESS_FORM_FIELD",
  payload: { fieldName, value },
});

export const updateBillingAddressForm = (billingAddress) => ({
  type: "UPDATE_BILLING_ADDRESS_FORM",
  payload: billingAddress,
});

export const updateBillingAddressFormFromApiResponse = (address) => {
  return {
    type: "UPDATE_BILLING_ADDRESS_FORM_FROM_API_RESPONSE",
    payload: snakeCaseToCamelCaseAllObjectKeys(address)
  };
};

export const updateBillingAddressFormFromGoogleMaps = (place) => {
  return {
    type: "UPDATE_BILLING_ADDRESS_FORM_FROM_API_RESPONSE",
    payload: convertGooglePlaceToAddress(place)
  };
}
