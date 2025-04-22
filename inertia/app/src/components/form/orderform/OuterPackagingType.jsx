import React from "react";
import LabeledInput from "../main/LabeledInput";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { useDispatch, useSelector } from "react-redux";
import { validateOuterPackagingType } from "../../../modules/orderFormValidation";
import { isDoubleLP } from "../../../reducers/orderFormReducer";

export const outerPackagingTypeOptions = [
  { value: "standardJacket", label: "Standard Jacket" },
  { value: "wideSpineJacket", label: "Wide Spine Jacket" },
  { value: "gatefoldJacket", label: "Gatefold Jacket" },
  { value: "customerSupplied", label: "Customer Supplied" },
  { value: "none", label: "None" },
];

export const outerPackagingTypeLabel = "Outer Packaging";
export const outerPackagingTypeName = "outerPackagingType";

export const OuterPackagingType = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isSearchable={false}
      validationResponse={validateOuterPackagingType(orderForm)}
      name={outerPackagingTypeName}
      onChange={(option) => {
        if (option.value === "none" || option.value === "customerSupplied") {
          dispatch(updateOrderFormField("outerPackagingFinish", null));
          dispatch(updateOrderFormField("outerPackagingPrint", null));
        }
        if (!isDoubleLP(orderForm) || option.value !== "standardJacket") {
          dispatch(updateOrderFormField(outerPackagingTypeName, option));
        }
      }}
      options={outerPackagingTypeOptions.map((option) => ({
        ...option,
        disabled: isDoubleLP(orderForm) && option.value === "standardJacket"
      }))}
      text={outerPackagingTypeLabel}
      type="Select"
      value={orderForm.outerPackagingType}
    />
  );
}

export default OuterPackagingType;