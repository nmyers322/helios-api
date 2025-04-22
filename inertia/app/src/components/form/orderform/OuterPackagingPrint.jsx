import React from "react";
import LabeledInput from "../main/LabeledInput";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateOuterPackagingPrint, validateOuterPackagingType } from "../../../modules/orderFormValidation";
import { useDispatch, useSelector } from "react-redux";

const outerPackagingPrintOptions = [
  { value: "bw", label: "Black and White Only" },
  { value: "color", label: "Full Color" },
];

const outerPackagingPrintLabel = "Outer Packaging Print";
const outerPackagingPrintName = "outerPackagingPrint";

const isDisabled = (orderForm) => {
  return !validateOuterPackagingType(orderForm).isValid ||
    orderForm.outerPackagingType.value === "none" ||
    orderForm.outerPackagingType.value === "customerSupplied";
};

const OuterPackagingPrint = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled(orderForm)}
      isSearchable={false}
      validationResponse={!isDisabled && validateOuterPackagingPrint(orderForm)}
      name={outerPackagingPrintName}
      onChange={(option) => dispatch(updateOrderFormField(outerPackagingPrintName, option))}
      options={outerPackagingPrintOptions}
      text={outerPackagingPrintLabel}
      type="Select"
      value={orderForm.outerPackagingPrint}
    />
  );
}

export default OuterPackagingPrint;

export {
  outerPackagingPrintOptions,
  OuterPackagingPrint,
  outerPackagingPrintLabel,
  outerPackagingPrintName,
};