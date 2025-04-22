import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validateAddress2 } from "../../../modules/accountValidation";

const address2Name = "address2";
const address2Label = "Apt, Suite, etc (Optional)";

const Address2 = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validateAddress2(addressForm)}
      name={address2Name}
      onChange={(e) =>
        dispatch(updateAddressFormField(address2Name, e.target.value))
      }
      text={address2Label}
      type="text"
      value={addressForm[address2Name]}
    />
  );
};

export default Address2;

export { address2Name, address2Label };