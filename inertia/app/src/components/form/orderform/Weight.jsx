import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateWeight } from "../../../modules/orderFormValidation";

const weightOptions = [
  { value: "160g", label: "Standard (160g)" },
  { value: "180g", label: "Heavy (180g)" },
];

const weightName = "weight";
const weightLabel = "Weight";

const Weight = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isSearchable={false}
      validationResponse={validateWeight(orderForm)}
      name={weightName}
      onChange={(option) => dispatch(updateOrderFormField(weightName, option))}
      options={weightOptions}
      text={weightLabel}
      type="Select"
      value={orderForm.weight}
    />
  );
}

export default Weight;

export {
  weightLabel,
  weightName,
  weightOptions,
  Weight,
};