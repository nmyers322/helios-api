import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validateCity } from "../../../modules/accountValidation";

const cityName = "city";
const cityLabel = "City";

const City = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validateCity(addressForm)}
      name={cityName}
      onChange={(e) =>
        dispatch(updateAddressFormField(cityName, e.target.value))
      }
      text={cityLabel}
      type="text"
      value={addressForm[cityName]}
    />
  );
};

export default City;

export { cityName, cityLabel };