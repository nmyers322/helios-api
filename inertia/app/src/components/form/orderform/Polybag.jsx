import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validatePolybag } from "../../../modules/orderFormValidation";

const PolybagOptions = [
  { value: "polybag", label: "Polybag" },
  { value: "resealablePolybag", label: "Resealable Polybag" },
  { value: "none", label: "None" },
];

const polybagLabel = "Polybag";
const polybagName = "polybag";

const Polybag = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isSearchable={false}
      validationResponse={validatePolybag(orderForm)}
      name={polybagName}
      onChange={(option) => dispatch(updateOrderFormField(polybagName, option))}
      options={PolybagOptions}
      text={polybagLabel}
      type="Select"
      value={orderForm.polybag}
    />
  );
}

export default Polybag;

export {
  PolybagOptions,
  Polybag,
  polybagLabel,
  polybagName,
};