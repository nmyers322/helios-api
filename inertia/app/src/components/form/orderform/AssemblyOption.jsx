import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateAssemblyOption } from "../../../modules/orderFormValidation";
import { outerPackagingTypeName } from "./OuterPackagingType";

const assemblyOptionOptions = [
  { value: "insertRecordInJacket", label: "Insert Record In Jacket" },
  { value: "placeRecordBehindJacket", label: "Place Record Behind Jacket" },
];

const assemblyOptionLabel = "Assembly Option";
const assemblyOptionName = "assemblyOption";

const AssemblyOption = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();

  const noOuterPackagingSelected = orderForm && orderForm[outerPackagingTypeName]?.value === "none";

  return (
    <LabeledInput
      helpText={noOuterPackagingSelected && "Note: No assembly option applies because no outer packaging is selected."}
      isDisabled={noOuterPackagingSelected}
      isSearchable={false}
      validationResponse={validateAssemblyOption(orderForm)}
      name={assemblyOptionName}
      onChange={(option) => dispatch(updateOrderFormField(assemblyOptionName, option))}
      options={assemblyOptionOptions}
      text={assemblyOptionLabel}
      type="Select"
      value={orderForm.assemblyOption}
    />
  );
}

export default AssemblyOption;

export {
  assemblyOptionOptions,
  AssemblyOption,
  assemblyOptionLabel,
  assemblyOptionName,
};