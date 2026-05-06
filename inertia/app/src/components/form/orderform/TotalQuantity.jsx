import React from "react";
import LabeledInput from "../main/LabeledInput";
import {
  updateOrderFormField,
  updateColorQuantity,
  updateColor,
} from "../../../actions/orderFormActions";
import { validateTotalQuantity, validateWeight } from "../../../modules/orderFormValidation";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableColors } from "../../../modules/colors";

export const minimumQuantity = 100;
export const maximumQuantity = 1000;
export const quantityFactor = 50;
export const maxColorVariations = 5;

export const totalQuantityLabel = "Total Quantity";
export const totalQuantityName = "totalQuantity";

export const TotalQuantity = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={!validateWeight(orderForm)}
      validationResponse={validateTotalQuantity(orderForm)}
      max={maximumQuantity}
      min={minimumQuantity}
      name={totalQuantityName}
      onChange={(event) => {
        const value = parseInt(event.target.value, 10);
        dispatch(updateOrderFormField(totalQuantityName, value));
        if (orderForm.colors.length === 0) {
          const firstColor = getAvailableColors().find((color) => color.value === "Black") || getAvailableColors()[0] || null;
          dispatch(updateColor(0, firstColor, value));
        } else if (orderForm.colors.length === 1) {
          dispatch(updateColorQuantity(0, value));
        }
      }}
      step={quantityFactor}
      text={totalQuantityLabel}
      type="number"
      value={orderForm.totalQuantity}
    />
  );
}

export default TotalQuantity;
