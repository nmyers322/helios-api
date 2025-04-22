import React from "react";
import LabeledInput from "../main/LabeledInput";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { useDispatch, useSelector } from "react-redux";
import { validateInsertType, validateInsertPrint } from "../../../modules/orderFormValidation";


const insertPrintOptions = [
  { value: "bw", label: "Black and White Only" },
  { value: "color", label: "Full Color" },
];

const insertPrintLabel = "Insert Print";
const insertPrintName = "insertPrint";

const isDisabled = (orderForm) => {
  return !validateInsertType(orderForm).isValid ||
    orderForm.insertType.value === "none" ||
    orderForm.insertType.value === "customerSupplied";
}

const InsertPrint = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled(orderForm)}
      isSearchable={false}
      validationResponse={!isDisabled && validateInsertPrint(orderForm)}
      name={insertPrintName}
      onChange={(option) => dispatch(updateOrderFormField(insertPrintName, option))}
      options={insertPrintOptions}
      text={insertPrintLabel}
      type="Select"
      value={orderForm.insertPrint}
    />
  );
}

export default InsertPrint;

export {
  insertPrintOptions,
  InsertPrint,
  insertPrintLabel,
  insertPrintName,
};