import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField } from "../../../actions/shippingAddressActions";
import { validateCompany } from "../../../modules/accountValidation";

const companyName = "company";
const companyLabel = "Company Name";

const Company = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validateCompany(addressForm, addressType)}
      name={companyName}
      onChange={(e) =>
        dispatch(updateAddressFormField(companyName, e.target.value))
      }
      text={companyLabel}
      type="text"
      value={addressForm[companyName]}
    />
  );
};

export default Company;

export { companyName, companyLabel };