import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateInnersleeve } from "../../../modules/orderFormValidation";

export const innersleeveOptions = [
  { value: "whitePaperSleeve", label: "White Paper Sleeve" },
  { value: "blackPolylinedSleeve", label: "Black Polylined Sleeve" },
];

export const innersleeveLabel = "Innsersleeve";
export const innersleeveName = "innersleeve";

export const Innersleeve = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isSearchable={false}
      validationResponse={validateInnersleeve(orderForm)}
      name={innersleeveName}
      onChange={(option) => dispatch(updateOrderFormField(innersleeveName, option))}
      options={innersleeveOptions}
      text={innersleeveLabel}
      type="Select"
      value={orderForm.innersleeve}
    />
  );
}

export default Innersleeve;