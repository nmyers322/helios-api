import { address1Name } from "../components/form/account/Address1";
import { address2Name } from "../components/form/account/Address2";
import { cityName } from "../components/form/account/City";
import { companyName } from "../components/form/account/Company";
import { countryName } from "../components/form/account/Country";
import { emailName } from "../components/form/account/Email";
import { firstNameName } from "../components/form/account/FirstName";
import { lastNameName } from "../components/form/account/LastName";
import { phoneName } from "../components/form/account/Phone";
import { postcodeName } from "../components/form/account/Postcode";
import { stateName } from "../components/form/account/State";
import { validateTextInput, ValidationResponse, valueIsEmpty } from "./validation";

export const customerShippingAddressIsEmpty = (customer) => {
  if (!customer.shipping 
    || (!customer.shipping.first_name
      && !customer.shipping.last_name
      && !customer.shipping.address1
      && !customer.shipping.city
      && !customer.shipping.country
      && !customer.shipping.postcode
      && !customer.shipping.state)) {
    return true;
  }
  return false;
};

export const customerShippingAndBillingAddressesAreEqual = (customer) => {
  if (customer.shipping
    && customer.billing
    && customer.shipping[firstNameName] === customer.billing[firstNameName]
    && customer.shipping[lastNameName] === customer.billing[lastNameName]
    && customer.shipping[address1Name] === customer.billing[address1Name]
    && customer.shipping[address2Name] === customer.billing[address2Name]
    && customer.shipping[cityName] === customer.billing[cityName]
    && customer.shipping[countryName] === customer.billing[countryName]
    && customer.shipping[postcodeName] === customer.billing[postcodeName]
    && customer.shipping[stateName] === customer.billing[stateName]) {
    return true;
  }
  return false;
};

const validateAddressFormObject = (addressForm) => {
  if (!addressForm) {
    return ValidationResponse.invalid(
      "Fatal error: address form object is missing"
    );
  }
  return ValidationResponse.valid();
};

const validateAddressFormInput = (addressForm, field) => {
  let response = validateAddressFormObject(addressForm);
  return response.isValid ? validateTextInput(addressForm[field]) : response;
};

const validateOptionalAddressFormInput = (addressForm, field) => {
  let response = validateAddressFormObject(addressForm);
  return response.isValid
    ? valueIsEmpty(addressForm[field])
      ? ValidationResponse.valid()
      : validateTextInput(addressForm[field], field) 
    : response;
}

export const validateAddress = (addressForm, addressType) => {
  let requiredFields = [address1Name, cityName, countryName, firstNameName, lastNameName, postcodeName, stateName];
  let optionalFields = [address2Name];
  let response;
  response = validateAddressFormObject(addressForm);
  if (!response.isValid) return response;
  for (const field of requiredFields) {
    response = validateAddressFormInput(addressForm, field);
    if (!response.isValid) return response;
  }
  for (const field of optionalFields) {
    response = validateOptionalAddressFormInput(addressForm, field);
    if (!response.isValid) return response;
  }
  if (addressType === "billing") {
    response = validateCompany(addressForm, addressType);
    if (!response.isValid) return response;
    response = validatePhone(addressForm[phoneName]);
    if (!response.isValid) return response;
  }
  return ValidationResponse.valid();
};

export const validateAddress1 = (addressForm) => {
  return validateAddressFormInput(addressForm, address1Name);
};

export const validateAddress2 = (addressForm) => {
  return validateOptionalAddressFormInput(addressForm, address2Name);
};

export const validateCity = (addressForm) => {
  return validateAddressFormInput(addressForm, cityName);
};

export const validateCompany = (addressForm, addressType) => {
  if (addressType === "shipping") {
    return validateOptionalAddressFormInput(addressForm, companyName);
  }
  return validateAddressFormInput(addressForm, companyName);
};

export const validateCountry = (addressForm) => {
  return validateAddressFormInput(addressForm, countryName);
};

export const validateEmail = (addressForm) => {
  let response = validateAddressFormInput(addressForm, emailName);
  if (!response.isValid) {
    return response;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(addressForm[emailName])) {
    return ValidationResponse.invalid("The email address is not formatted properly");
  }
  return ValidationResponse.valid();
};

export const validateFirstName = (addressForm) => {
  return validateAddressFormInput(addressForm, firstNameName);
};

export const validateLastName = (addressForm) => {
  return validateAddressFormInput(addressForm, lastNameName);
};

export const validatePhone = (phone) => {
  // const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  //if (!phoneRegex.test(phone)) {
  if (phone?.length < 1) {
    return ValidationResponse.invalid("Phone number is not valid");
  }
  return ValidationResponse.valid();
};

export const validatePostcode = (addressForm) => {
  return validateAddressFormInput(addressForm, postcodeName);
};

export const validateState = (addressForm) => {
  return validateAddressFormInput(addressForm, stateName);
};

export const validateVisiblePhoneInput = () => {
  if (document.getElementsByClassName("form-control invalid-number").length > 0) {
    return ValidationResponse.invalid("A valid phone number is required");
  }
  return ValidationResponse.valid();
};

export const validateBillingAddressCard = (billingAddressForm) => {
  if (!validateFirstName(billingAddressForm).isValid) {
    return ValidationResponse.invalid("First name is required");
  }
  if (!validateLastName(billingAddressForm).isValid) {
    return ValidationResponse.invalid("Last name is required");
  }
  if (!validateCompany(billingAddressForm, "billing").isValid) {
    return ValidationResponse.invalid("Company name is required");
  }
  if (!validateVisiblePhoneInput().isValid || !validatePhone(billingAddressForm[phoneName]).isValid) {
    return ValidationResponse.invalid("Phone number is required");
  }
  if (!validateAddress1(billingAddressForm).isValid) {
    return ValidationResponse.invalid("Address is required");
  }
  if (!validateAddress2(billingAddressForm).isValid) {
    return ValidationResponse.invalid("Address Line 2 must be valid");
  }
  if (!validateCity(billingAddressForm).isValid) {
    return ValidationResponse.invalid("City is required");
  }
  if (!validateState(billingAddressForm).isValid) {
    return ValidationResponse.invalid("State is required");
  }
  if (!validatePostcode(billingAddressForm).isValid) {
    return ValidationResponse.invalid("Postcode is required");
  }
  if (!validateCountry(billingAddressForm).isValid) {
    return ValidationResponse.invalid("Country is required");
  }
  return ValidationResponse.valid();
};

export const validateShippingAddressCard = (shippingAddressForm) => {
  if (!validateFirstName(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("First name is required");
  }
  if (!validateLastName(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("Last name is required");
  }
  if (!validateAddress1(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("Address is required");
  }
  if (!validateAddress2(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("Address Line 2 must be valid");
  }
  if (!validateCity(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("City is required");
  }
  if (!validateState(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("State is required");
  }
  if (!validatePostcode(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("Postcode is required");
  }
  if (!validateCountry(shippingAddressForm).isValid) {
    return ValidationResponse.invalid("Country is required");
  }
  return ValidationResponse.valid();
};