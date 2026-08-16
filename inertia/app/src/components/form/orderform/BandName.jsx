import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateBandName } from "../../../modules/orderFormValidation";

export const bandNameName = "bandName";
export const bandNameLabel = "Band Name";

const BandName = () =>{
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      ignorePackageLock={true}
      validationResponse={validateBandName(orderForm)}
      name={bandNameName}
      onChange={(e) => dispatch(updateOrderFormField(bandNameName, e.target.value))}
      text={bandNameLabel}
      type="text"
      value={orderForm.bandName}
    />
  );
}

export default BandName;