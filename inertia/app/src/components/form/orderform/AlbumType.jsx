import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateAlbumType } from "../../../modules/orderFormValidation";

export const albumTypeOptionSingle = "single";
export const albumTypeOptionDouble = "double";

export const albumTypeOptions = [
  { value: albumTypeOptionSingle, label: "Single LP" },
  { value: albumTypeOptionDouble, label: "Double LP" },
];

export const albumTypeName = "albumType";
export const albumTypeLabel = "Album Type";
export const recordSetupFeeLabel = "Record Setup Fee";

export const AlbumType = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isSearchable={false}
      validationResponse={validateAlbumType(orderForm)}
      name={albumTypeName}
      onChange={(option) =>
        dispatch(updateOrderFormField(albumTypeName, option))
      }
      options={albumTypeOptions}
      text={albumTypeLabel}
      type="Select"
      value={orderForm.albumType}
    />
  );
}

export default AlbumType;