import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validatePostcode } from "../../../modules/accountValidation";

const postcodeName = "postcode";
const postcodeLabel = "Zip/Postal Code";

const Postcode = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validatePostcode(addressForm)}
      name={postcodeName}
      onChange={(e) =>
        dispatch(updateAddressFormField(postcodeName, e.target.value))
      }
      text={postcodeLabel}
      type="text"
      value={addressForm[postcodeName]}
    />
  );
};

export default Postcode;

export { postcodeName, postcodeLabel };