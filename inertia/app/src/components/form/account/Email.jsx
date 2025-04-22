import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { validateEmail } from "../../../modules/accountValidation";

const emailName = "email";
const emailLabel = "Email";

const Email = ({
  isDisabled = false,
  addressType = "billing"
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      name={emailName}
      onChange={(e) =>
        dispatch(updateBillingAddressFormField(emailName, e.target.value))
      }
      text={emailLabel}
      type="text"
      validationResponse={validateEmail(addressForm)}
      value={addressForm[emailName]}
    />
  );
};

export default Email;

export { emailName, emailLabel };