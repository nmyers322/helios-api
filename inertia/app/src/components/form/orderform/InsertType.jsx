import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateInsertType } from "../../../modules/orderFormValidation";

const insertTypeOptions = [
  { value: "one", label: "One Side" },
  { value: "two", label: "Two Sides" },
  { value: "customerSupplied", label: "Customer Supplied" },
  { value: "none", label: "None" },
];

const insertTypeLabel = "Insert";
const insertTypeName = "insertType";

const InsertType = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isSearchable={false}
      validationResponse={validateInsertType(orderForm)}
      name={insertTypeName}
      options={insertTypeOptions}
      onChange={(option) => {
        if (option.value === "none" || option.value === "customerSupplied") {
          dispatch(updateOrderFormField("insertPrint", null));
          dispatch(updateOrderFormField("insertFinish", null));
        }
        dispatch(updateOrderFormField(insertTypeName, option));
      }}
      text={insertTypeLabel}
      type="Select"
      value={orderForm.insertType}
    />
  );
}

export default InsertType;

export {
  insertTypeOptions,
  InsertType as Insert,
  insertTypeLabel,
  insertTypeName,
};
