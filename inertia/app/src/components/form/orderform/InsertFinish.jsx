import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateInsertFinish, validateInsertPrint, validateInsertType } from "../../../modules/orderFormValidation";

const insertFinishOptions = [
  { value: "glossy", label: "Glossy" },
  { value: "uncoated", label: "Uncoated" },
];

const insertFinishLabel = "Insert Finish";
const insertFinishName = "insertFinish";

const isDisabled = (orderForm) => {
  return !validateInsertType(orderForm).isValid ||
    !validateInsertPrint(orderForm).isValid ||
    orderForm.insertType.value === "none" ||
    orderForm.insertType.value === "customerSupplied";
}

const InsertFinish = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
    isDisabled={isDisabled(orderForm)}
      isSearchable={false}
      validationResponse={!isDisabled && validateInsertFinish(orderForm)}
      name={insertFinishName}
      options={insertFinishOptions}
      onChange={(option) => dispatch(updateOrderFormField(insertFinishName, option))}
      text={insertFinishLabel}
      type="Select"
      value={orderForm.insertFinish}
    />
  );
}

export default InsertFinish;

export {
  insertFinishOptions,
  InsertFinish,
  insertFinishLabel,
  insertFinishName,
};