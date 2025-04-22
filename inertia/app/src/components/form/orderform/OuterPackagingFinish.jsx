import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateOuterPackagingFinish, validateOuterPackagingPrint, validateOuterPackagingType } from "../../../modules/orderFormValidation";

const outerPackagingFinishOptions = [
  { value: "standardGloss", label: "Standard Gloss" },
  { value: "matteVarnish", label: "Matte Varnish" },
  { value: "highGlossUVVarnish", label: "High Gloss UV Varnish" },
  { value: "reversePrint", label: "Reverse Print" },
];

const outerPackagingFinishLabel = "Outer Packaging Finish";
const outerPackagingFinishName = "outerPackagingFinish";

const isDisabled = (orderForm) => {
  return !validateOuterPackagingType(orderForm).isValid ||
    !validateOuterPackagingPrint(orderForm).isValid ||
    orderForm.outerPackagingType.value === "none" ||
    orderForm.outerPackagingType.value === "customerSupplied";
};

const OuterPackagingFinish = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={isDisabled(orderForm)}
      isSearchable={false}
      validationResponse={!isDisabled && validateOuterPackagingFinish(orderForm)}
      name={outerPackagingFinishName}
      onChange={(option) => dispatch(updateOrderFormField(outerPackagingFinishName, option))}
      options={outerPackagingFinishOptions}
      text={outerPackagingFinishLabel}
      type="Select"
      value={orderForm.outerPackagingFinish}
    />
  );
}

export default OuterPackagingFinish;

export {
  outerPackagingFinishOptions,
  OuterPackagingFinish,
  outerPackagingFinishLabel,
  outerPackagingFinishName,
};