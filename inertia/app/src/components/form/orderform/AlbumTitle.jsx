import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateAlbumTitle } from "../../../modules/orderFormValidation";

export const albumTitleName = "albumTitle";
export const albumTitleLabel = "Album Title";

const AlbumTitle = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      validationResponse={validateAlbumTitle(orderForm)}
      name={albumTitleName}
      onChange={(e) =>
        dispatch(updateOrderFormField(albumTitleName, e.target.value))
      }
      text={albumTitleLabel}
      type="text"
      value={orderForm.albumTitle}
    />
  );
};

export default AlbumTitle;