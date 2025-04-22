import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validateFirstName } from "../../../modules/accountValidation";

const firstNameName = "firstName";
const firstNameLabel = "First Name";

const FirstName = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validateFirstName(addressForm)}
      name={firstNameName}
      onChange={(e) =>
        dispatch(updateAddressFormField(firstNameName, e.target.value))
      }
      text={firstNameLabel}
      type="text"
      value={addressForm[firstNameName]}
    />
  );
};

export default FirstName;

export { firstNameName, firstNameLabel };