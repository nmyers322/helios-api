import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validateCountry } from "../../../modules/accountValidation";
import { countryList } from "../../../modules/countryList";

export const countryName = "country";
export const countryLabel = "Country";

const Country = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  const value = countryList.find((country) => country.value === addressForm[countryName]);
  return (
    <LabeledInput
      isDisabled={isDisabled}
      isSearchable={true}
      validationResponse={validateCountry(addressForm)}
      name={countryName}
      onChange={(option) =>
        dispatch(updateAddressFormField(countryName, option.value))
      }
      options={countryList}
      text={countryLabel}
      type="Select"
      value={value}
    />
  );
};

export default Country;