import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validateLastName } from "../../../modules/accountValidation";

const lastNameName = "lastName";
const lastNameLabel = "Last Name";

const LastName = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validateLastName(addressForm)}
      name={lastNameName}
      onChange={(e) =>
        dispatch(updateAddressFormField(lastNameName, e.target.value))
      }
      text={lastNameLabel}
      type="text"
      value={addressForm[lastNameName]}
    />
  );
};

export default LastName;

export { lastNameName, lastNameLabel };