import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validateState } from "../../../modules/accountValidation";

const stateName = "state";
const stateLabel = "State/Province";

const State = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validateState(addressForm)}
      name={stateName}
      onChange={(e) =>
        dispatch(updateAddressFormField(stateName, e.target.value))
      }
      text={stateLabel}
      type="text"
      value={addressForm[stateName]}
    />
  );
};

export default State;

export { stateName, stateLabel };