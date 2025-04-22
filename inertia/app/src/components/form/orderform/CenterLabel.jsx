import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateCenterLabel } from "../../../modules/orderFormValidation";

export const centerLabelOptions = [
  { value: "bw", label: "Black and White Only" },
  { value: "color", label: "Full Color" },
  { value: "customerSupplied", label: "Customer Supplied" },
];

export const centerLabelLabel = "Center Label";
export const centerLabelName = "centerLabel";

export const CenterLabel = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isSearchable={false}
      validationResponse={validateCenterLabel(orderForm)}
      name={centerLabelName}
      onChange={(option) => dispatch(updateOrderFormField(centerLabelName, option))}
      options={centerLabelOptions}
      text={centerLabelLabel}
      type="Select"
      value={orderForm.centerLabel}
    />
  );
}

export default CenterLabel;